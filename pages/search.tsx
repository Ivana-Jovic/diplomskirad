import {
  Box,
  Chip,
  Rating,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import * as React from "react";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { useEffect, useState, useRef, MouseEvent } from "react";
import CardSearch from "../components/cardsearch";
import Layout from "../components/layout";
import { db } from "../firebase";
import { styled } from "@mui/material/styles";
import Map2 from "../components/map2";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import {
  isAvailable,
  isFullyRegisteredUser,
  isHost,
  isLoggedUser,
  removedByAdmin,
} from "../lib/hooks";

import { GetServerSideProps } from "next";
import { clearTimeout, setTimeout } from "timers";
import ErrorPage from "./errorpage";
import { AuthContext } from "../firebase-authProvider";
import RemovedByAdmin from "../components/removedbyadmin";

const AirbnbSlider = styled(Slider)(({ theme }) => ({
  color: "#3a8589",
  height: 3,
  padding: "13px 0",
  "& .MuiSlider-thumb": {
    height: 27,
    width: 27,
    backgroundColor: "#fff",
    border: "1px solid currentColor",
    "&:hover": {
      boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)",
    },
    "& .airbnb-bar": {
      height: 9,
      width: 1,
      backgroundColor: "currentColor",
      marginLeft: 1,
      marginRight: 1,
    },
  },
  "& .MuiSlider-track": {
    height: 3,
  },
  "& .MuiSlider-mark": {
    color: "#f8fafc",
  },
  "& .MuiSlider-rail": {
    color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8",
    opacity: theme.palette.mode === "dark" ? undefined : 1,
    height: 3,
  },
}));
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: 0,
    "&.Mui-disabled": {
      border: 0,
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

function valuetext(value: number) {
  return `${value}€`;
}

export default function Search({
  location,
  fromStr,
  toStr,
  rooms,
  numOfGuests,
  numPropertiesLocation,
  sumPricesPropertiesLocation,
  ppp,
}: {
  location: string;
  fromStr: string;
  toStr: string;
  rooms: number;
  numOfGuests: number;
  numPropertiesLocation: number;
  sumPricesPropertiesLocation: number;
  ppp: string;
}) {
  const { user, myUser, hostModeHostC, setHostModeHostC } =
    React.useContext(AuthContext);
  useEffect(() => {
    if (myUser && myUser.host && hostModeHostC) {
      //can access only if isHostModeTravel, else change mod
      setHostModeHostC(false);
    }
  }, [myUser]);
  const fromDate = new Date(fromStr);
  const toDate = new Date(toStr);
  var rangeRef = useRef<NodeJS.Timeout>(null);
  const arr: DocumentData[] = JSON.parse(ppp);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [filteredArr, setFilteredArr] = useState<DocumentData[]>(arr); //any
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [selectedSuperhost, setSelectedSuperhost] = useState<boolean>(false);
  const [selectedRatingFourAndUp, setSelectedRatingFourAndUp] =
    useState<boolean>(false);
  const [selectedGarage, setSelectedGarage] = useState<boolean>(false);
  const [selectedPrice, setSelectedPrice] = useState<boolean>(false);
  const [sortPrice, setSortPrice] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]); //put max when adding property
  const factorPrice = 10;

  console.log("...", arr.length, filteredArr.length);

  const shouldBeShown = (
    num: number,
    propertyid: string,
    selected: boolean,
    is: boolean
  ) => {
    if ((selected && is) || !selected) {
      console.log(propertyid, "shouldBeShown TRUE", selected, is, num);
      return true;
    } else {
      console.log(propertyid, "shouldBeShown FALSE", selected, is, num);
      return false;
    }
  };

  const filterProperties = (item: DocumentData) => {
    const property = item;
    const propertyid = item.id;
    console.log(
      "PRICE",
      property.pricePerNight,
      priceRange[0] * factorPrice,
      priceRange[1] * factorPrice
    );
    if (
      shouldBeShown(1, propertyid, selectedSuperhost, property.isSuperhost) &&
      shouldBeShown(
        2,
        propertyid,
        selectedRatingFourAndUp,
        property.totalStars / property.numberOfReviews >= 4
      ) &&
      shouldBeShown(3, propertyid, selectedGarage, property.garage) &&
      shouldBeShown(
        4,
        propertyid,
        true,
        priceRange[0] * factorPrice <= property.pricePerNight &&
          priceRange[1] * factorPrice >= property.pricePerNight
      )
    ) {
      console.log(propertyid, "TRUE", sortPrice);
      return true;
    }

    console.log(
      propertyid,
      "FALSE",
      selectedGarage,
      property.garage,
      selectedSuperhost,
      property.isSuperhost,
      priceRange[0],
      priceRange[0] * factorPrice <= property.pricePerNight
    );
    return false;
  };
  useEffect(() => {
    setFilteredArr(arr);
    setSelectedSuperhost(false);
    setSelectedRatingFourAndUp(false);
    setSelectedGarage(false);
    setSelectedPrice(false);
    setSortPrice(null);
    setPriceRange([0, 100]);
  }, [ppp]);

  useEffect(() => {
    if (
      selectedSuperhost ||
      selectedRatingFourAndUp ||
      selectedGarage ||
      selectedPrice ||
      sortPrice ||
      sortPrice === null
    ) {
      setFilteredArr([]);
      setFilteredArr(arr);
      setFilteredArr((prev) => [...prev].filter(filterProperties));
      if (sortPrice === "asc") {
        console.log("ASC");
        setFilteredArr((prev) =>
          [...prev]
            .slice() //Shallow copy :https://stackoverflow.com/questions/67122915/sort-method-is-not-working-with-usestate-in-react
            .sort(
              (a: DocumentData, b: DocumentData) =>
                a.pricePerNight - b.pricePerNight
            )
        ); // a i b any
      } else if (sortPrice === "desc") {
        console.log("DESC");
        setFilteredArr((prev) =>
          [...prev]
            .slice() //Shallow copy :https://stackoverflow.com/questions/67122915/sort-method-is-not-working-with-usestate-in-react
            .sort(
              (a: DocumentData, b: DocumentData) =>
                b.pricePerNight - a.pricePerNight
            )
        ); // a i b any
      } else {
        console.log("NIJE NI RASTUCE NI OP");
      }
    } else {
      setFilteredArr([]);
      setFilteredArr(() => {
        return arr;
      });
    }
  }, [
    selectedSuperhost,
    selectedRatingFourAndUp,
    selectedGarage,
    selectedPrice,
    priceRange[0],
    priceRange[1],
    sortPrice,
  ]);

  return (
    <Layout
      placeholder={
        location + " | " + numOfGuests + " guests" + " | " + rooms + " rooms"
      }
    >
      <div className=" flex  flex-col max-w-7xl mx-auto px-8 sm:px-16">
        <section className="  px-10 py-10 w-full ">
          <div className="text-sm pb-5">
            Stay in {location} <br />
            from {fromStr} to {toStr} <br />
            {numOfGuests} guests - {rooms} rooms <br />
            Average price per night in {location} is{" "}
            {(sumPricesPropertiesLocation / numPropertiesLocation).toFixed(1)}€
          </div>
          <div className="text-4xl mb-6">Stays in {location}</div>
          <div className="flex flex-col sm:flex-row mb-5 space-y-3 sm:space-y-0 sm:space-x-3 text-gray-800">
            <div className="flex space-x-3">
              <div className="dropdown ">
                <div tabIndex={0} className=" ">
                  <Chip
                    label="Price"
                    variant={selectedPrice ? "filled" : "outlined"}
                    onClick={(event: any) => {
                      setAnchorEl(event.currentTarget);
                    }}
                  />
                </div>
                <ul
                  tabIndex={0}
                  className="border dropdown-content menu p-2 shadow
                  bg-bgBase rounded-box w-64 sm:w-96
                 flex items-center
                  "
                >
                  <li>
                    <div className="mt-10 flex flex-col w-52 sm:w-80  !bg-transparent">
                      <Box sx={{ width: "90%" }}>
                        <AirbnbSlider
                          getAriaLabel={() => "Price range"}
                          value={priceRange}
                          onChange={(e: Event, newValue: number | number[]) => {
                            if (rangeRef !== null) {
                              //PAZI OVDE JE BILO OBICNO != AKO NE RADI VRATI OVO
                              clearTimeout(rangeRef.current);
                            }
                            rangeRef.current = setTimeout(() => {
                              setPriceRange(newValue as number[]);
                              setSelectedPrice(true);
                            }, 100); //500
                          }}
                          getAriaValueText={valuetext}
                          marks={[
                            {
                              value: 0,
                              label: "0e",
                            },
                            {
                              value: 100,
                              label: "1000e",
                            },
                          ]}
                        />
                      </Box>
                      <div className="mb-4  flex">
                        Price from&nbsp;
                        <div className="font-medium">
                          {priceRange[0] * factorPrice}e
                        </div>
                        &nbsp;to&nbsp;
                        <div className="font-medium">
                          {priceRange[1] * factorPrice}e
                        </div>
                      </div>
                      <StyledToggleButtonGroup
                        value={sortPrice}
                        exclusive
                        onChange={(e: MouseEvent, val: string | null) => {
                          setSortPrice(val);
                          setSelectedPrice(true);
                        }}
                        aria-label="sortPrice"
                      >
                        <ToggleButton value="asc" aria-label="asc">
                          Sort ascending
                        </ToggleButton>
                        <ToggleButton value="desc" aria-label="desc">
                          Sort descending
                        </ToggleButton>
                      </StyledToggleButtonGroup>
                    </div>
                  </li>
                </ul>
              </div>
              <Chip
                icon={
                  <Rating name="read-only" value={4} readOnly size="small" />
                }
                label="& up"
                variant={selectedRatingFourAndUp ? "filled" : "outlined"}
                onClick={() => {
                  setSelectedRatingFourAndUp(!selectedRatingFourAndUp);
                }}
              />
            </div>
            <div className="flex space-x-3">
              <Chip
                label="Garage"
                variant={selectedGarage ? "filled" : "outlined"}
                onClick={() => {
                  setSelectedGarage(!selectedGarage);
                }}
              />
              <Chip
                label="Superhost"
                variant={selectedSuperhost ? "filled" : "outlined"}
                onClick={() => {
                  setSelectedSuperhost(!selectedSuperhost);
                }}
              />
            </div>
          </div>
          <div className="flex flex-col-reverse lg:flex-row  justify-between gap-10 ">
            <div className="flex flex-col w-full">
              {filteredArr.map((item) => {
                const property = item;
                const propertyid = item.id;
                return (
                  <CardSearch
                    key={propertyid}
                    propertyid={propertyid}
                    name={property.title}
                    description={property.description}
                    image={property.images[0]}
                    price={property.pricePerNight}
                    totalStars={property.totalStars}
                    numberOfReviews={property.numberOfReviews}
                    numberOfNights={
                      fromDate && toDate
                        ? Math.round(
                            (toDate.getTime() - fromDate.getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        : 0
                    }
                    avgPricePerNight={
                      sumPricesPropertiesLocation / numPropertiesLocation
                    }
                    inWishlist={false}
                  />
                );
              })}
            </div>
            <div
              className="flex flex-col items-center justify-center mt-10 lg:mt-3 
            lg:h-[600px] lg:w-96 lg:xl:w-[500px]
            w-full h-96 "
            >
              {filteredArr && filteredArr.length > 0 && (
                <Map2 arrLoc={filteredArr} />
              )}
              {filteredArr && filteredArr.length >= 0 && (
                <div className=" badge text-center w-full mt-5">
                  {filteredArr.length} search results
                </div>
              )}
            </div>
          </div>
        </section>
        {/* {filteredArr && filteredArr.length === 0 && (
          <div className=" badge text-center w-full">**No search results**</div>
        )}*/}
      </div>
    </Layout>
  );
}

async function getEverything(context) {
  const queryUrl = context.query;
  const { location: locationQuery, from, to } = queryUrl;
  const location: string = locationQuery
    ? locationQuery.includes(", ")
      ? (locationQuery as string).split(", ")[0]
      : (locationQuery as string)
    : "";
  const fromDate = new Date(queryUrl.from as string);
  const toDate = new Date(queryUrl.to as string);
  const rooms = (queryUrl.rooms ?? 0) as number;
  const numOfGuests = (queryUrl.numOfGuests ?? 0) as number;

  const querySnapshot1 = await getDocs(
    query(collection(db, "property"), where("city", "==", location))
  );

  const querySnapshot2 = await getDocs(
    query(collection(db, "property"), where("state", "==", location))
  );
  let r: QueryDocumentSnapshot<DocumentData>[] = querySnapshot1.docs.concat(
    querySnapshot2.docs
  );

  var arr: DocumentData[] = [];

  var numPropertiesLocation = 0;
  var sumPricesPropertiesLocation = 0;
  for (let index = 0; index < r.length; index++) {
    var property = r[index];
    numPropertiesLocation = 1 + numPropertiesLocation;
    sumPricesPropertiesLocation =
      sumPricesPropertiesLocation + property.data().pricePerNight;
    if (
      rooms &&
      numOfGuests &&
      property.data().numOfPersons >= numOfGuests &&
      property.data().numOfRooms >= rooms
    ) {
      const isAv = await isAvailable(fromDate, toDate, property.id);
      if (isAv) {
        arr.push(property.data());
      }
    }
  }

  const u: ReturnType = {
    location,
    from,
    to,
    rooms,
    numOfGuests,
    numPropertiesLocation,
    sumPricesPropertiesLocation,
    arr,
  };
  return u;
}
type ReturnType = {
  location: string;
  from: any;
  to: any;
  rooms: number;
  numOfGuests: number;
  numPropertiesLocation: number;
  sumPricesPropertiesLocation: number;
  arr: DocumentData[];
};
export async function getServerSideProps(context) {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=100"
  );
  try {
    const queryUrl = context.query;
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

    var hasPermission: boolean = false;
    // const docSnap = await getDoc(doc(db, "users", uid));
    const [docSnap, returns] = await Promise.all([
      getDoc(doc(db, "users", uid)),
      getEverything(context),
    ]);
    if (docSnap.exists()) {
      const myUser: DocumentData = docSnap.data();
      if (!isFullyRegisteredUser(myUser)) {
        return {
          redirect: {
            destination: "/profilesettings",
          },
          props: [],
        };
      }
      if (isLoggedUser(myUser) || isHost(myUser)) {
        hasPermission = true;
        if (removedByAdmin(myUser)) {
          return {
            redirect: {
              destination: "/removedbyadmin",
            },
            props: [],
          };
        }
      }
    }
    console.log(hasPermission);
    if (!hasPermission) {
      return {
        redirect: {
          destination: "/",
        },
        props: [],
      };
    }
    // const returns: ReturnType = await getEverything(context);

    return {
      props: {
        location: returns.location,
        fromStr: returns.from,
        toStr: returns.to,
        rooms: returns.rooms,
        numOfGuests: returns.numOfGuests,
        numPropertiesLocation: returns.numPropertiesLocation,
        sumPricesPropertiesLocation: returns.sumPricesPropertiesLocation,
        ppp: JSON.stringify(returns.arr),
      },
    };
  } catch (err) {
    const returns: ReturnType = await getEverything(context);

    return {
      props: {
        location: returns.location,
        fromStr: returns.from,
        toStr: returns.to,
        rooms: returns.rooms,
        numOfGuests: returns.numOfGuests,
        numPropertiesLocation: returns.numPropertiesLocation,
        sumPricesPropertiesLocation: returns.sumPricesPropertiesLocation,
        ppp: JSON.stringify(returns.arr),
      },
    };
  }
}
