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
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState, useRef, MouseEvent } from "react";
import CardSearch from "../components/cardsearch";
import Layout from "../components/layout";
import { db } from "../firebase";
import { styled } from "@mui/material/styles";
import Map2 from "../components/map2";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  isAvailable,
  isHostModeTravel,
  isLoggedUser,
  isUnloggedUser,
} from "../lib/hooks";
import { AnyARecord } from "dns";
import { GetServerSideProps } from "next";
import { clearTimeout, setTimeout } from "timers";
import ErrorPage from "./errorpage";
import { AuthContext } from "../firebase-authProvider";

const AirbnbSlider = styled(Slider)(({ theme }) => ({
  //   color: "#3a8589",
  //   height: 3,
  //   padding: "13px 0",
  //   "& .MuiSlider-thumb": {
  //     height: 27,
  //     width: 27,
  //     backgroundColor: "#fff",
  //     border: "1px solid currentColor",
  //     "&:hover": {
  //       boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)",
  //     },
  //     "& .airbnb-bar": {
  //       height: 9,
  //       width: 1,
  //       backgroundColor: "currentColor",
  //       marginLeft: 1,
  //       marginRight: 1,
  //     },
  //   },
  //   "& .MuiSlider-track": {
  //     height: 3,
  //   },
  //   "& .MuiSlider-mark": {
  //     color: "#f8fafc",
  //   },
  //   "& .MuiSlider-rail": {
  //     color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8",
  //     opacity: theme.palette.mode === "dark" ? undefined : 1,
  //     height: 3,
  //   },
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

// async function isAvailable(from: Date, to: Date, propertyId: string) {
//   const querySnapshot6 = await getDocs(
//     query(collection(db, "reservations"), where("propertyId", "==", propertyId))
//   );
//   for (let index = 0; index < querySnapshot6.docs.length; index++) {
//     const doc = querySnapshot6.docs[index];
//     //oni koji se potencijalno poklapaju
//     if (new Date(doc.data().to) <= from || new Date(doc.data().from) >= to) {
//       //ne poklapaju se
//     } else {
//       //poklapaju se kako god
//       //ako je doc.to izmedju to i from poklapaju se sigurno
//       //ako doc.to vece od to poklapaju se  ako je from iymedju ili pre from
//       //
//       console.log(
//         "ELSE GRANA",
//         propertyId,
//         from.toDateString(),
//         to.toDateString()
//       );
//       return false;
//     }
//   }
//   return true;
// }
export default function Search({
  uid,
  location,
  // fromDateJSON,
  // toDateJSON,
  fromStr,
  toStr,
  rooms,
  numOfGuests,
  numPropertiesLocation,
  sumPricesPropertiesLocation,
  ppp,
}: {
  uid: string;
  location: string;
  // fromDateJSON: string;
  // toDateJSON: string;
  fromStr: string;
  toStr: string;
  rooms: number;
  numOfGuests: number;
  numPropertiesLocation: number;
  sumPricesPropertiesLocation: number;
  ppp: string;
  //  DocumentData[]; //OVO JE RADILI SA ANY
}) {
  // const fromDate: Date = JSON.parse(fromDateJSON);
  // const toDate: Date = JSON.parse(toDateJSON);
  const fromDate = new Date(fromStr);
  const toDate = new Date(toStr);
  var rangeRef = useRef<NodeJS.Timeout>(null);
  const arr: DocumentData[] = JSON.parse(ppp);
  // const arr = ppp;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  //U GSP su ove
  // const [numPropertiesLocation, setNumPropertiesLocation] = useState<number>(0);
  // const [sumPricesPropertiesLocation, setSumPricesPropertiesLocation] =
  //   useState<number>(0);
  // const router = useRouter();
  // const { location: locationQuery, from, to } = router.query;
  // const location: string = locationQuery
  //   ? locationQuery.includes(", ")
  //     ? (locationQuery as string).split(", ")[0]
  //     : (locationQuery as string)
  //   : "";
  // const fromDate = new Date(router.query.from as string);
  // const toDate = new Date(router.query.to as string);
  // const rooms = (router.query.rooms ?? 0) as number;
  // const numOfGuests = (router.query.numOfGuests ?? 0) as number;
  // //const [arr, setArr] = useState<any[]>([]);
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

  // const getSearchProperties = async () => {
  // console.log("in search gethostproperty");
  // const qs44: string[] = [];
  // const qs33: string[] = [];
  // const querySnapshot1 = await getDocs(
  //   query(collection(db, "property"), where("city", "==", location))
  // );
  // const querySnapshot2 = await getDocs(
  //   query(collection(db, "property"), where("state", "==", location))
  // );
  // // setFilteredArr([]);ks
  // // setArr([]);
  // let r: QueryDocumentSnapshot<DocumentData>[] = querySnapshot1.docs.concat(
  //   querySnapshot2.docs
  // );
  // setArr([]);
  // setFilteredArr([]);
  // //UNIJA
  // setNumPropertiesLocation(0);
  // setSumPricesPropertiesLocation(0);
  // // r
  // r.forEach(async (doc) => {
  //   setNumPropertiesLocation((prev) => prev + 1);
  //   setSumPricesPropertiesLocation((prev) => prev + doc.data().pricePerNight);
  //   if (
  //     rooms &&
  //     numOfGuests &&
  //     doc.data().numOfPersons >= numOfGuests &&
  //     doc.data().numOfRooms >= rooms
  //   ) {
  //     console.log("MAIN", fromDate, toDate);
  //     isAvailable(fromDate, toDate, doc.id).then((isAv) => {
  //       if (isAv) {
  //         setArr((prev) => {
  //           return [...prev, doc];
  //         });
  //         setFilteredArr((prev) => {
  //           return [...prev, doc];
  //         });
  //       }
  //     });
  //   }
  // });
  // };

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
    //any
    const property = item;
    const propertyid = item.id;
    //if selectedSuperhost and isSuperhost
    // or !selectedSuperhost   -> SHOULD BE SHOWN
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
    // if (firstLoad) {
    //   // setArr([]);
    //   setFilteredArr([]);
    // }
    if (
      selectedSuperhost ||
      selectedRatingFourAndUp ||
      selectedGarage ||
      selectedPrice ||
      sortPrice ||
      sortPrice == null
    ) {
      setFilteredArr([]);
      setFilteredArr(arr);
      setFilteredArr((prev) => [...prev].filter(filterProperties));
      if (sortPrice == "asc") {
        console.log("ASC");
        setFilteredArr((prev) =>
          [...prev]
            .slice() //Shallow copy :https://stackoverflow.com/questions/67122915/sort-method-is-not-working-with-usestate-in-react
            .sort(
              (a: DocumentData, b: DocumentData) =>
                a.pricePerNight - b.pricePerNight
            )
        ); // a i b any
      } else if (sortPrice == "desc") {
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

  // useEffect(() => {
  //   setArr([]);
  //   setFilteredArr([]);
  //   if (
  //     location != undefined &&
  //     rooms != undefined &&
  //     numOfGuests != undefined &&
  //     fromDate != undefined &&
  //     toDate != undefined &&
  //     rooms &&
  //     location &&
  //     numOfGuests &&
  //     fromDate &&
  //     toDate
  //   ) {
  //     setFirstLoad(false);
  //     setArr([]);
  //     setFilteredArr([]);
  //     getSearchProperties();
  //   }
  // }, [location, rooms, numOfGuests]);

  const { user, myUser } = React.useContext(AuthContext);
  if (
    isUnloggedUser(user, myUser) ||
    isLoggedUser(user, myUser) ||
    isHostModeTravel(user, myUser)
  )
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
              {(sumPricesPropertiesLocation / numPropertiesLocation).toFixed(1)}
              e
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
                  bg-base-100 rounded-box w-64 sm:w-96
                 flex items-center
                  "
                  >
                    <li>
                      {/* hover:bg-inherit*/}
                      <div className="mt-10 flex flex-col w-52   !bg-transparent">
                        <Box sx={{ width: 300 }} className="w-52 sm:w-80">
                          <AirbnbSlider
                            getAriaLabel={() => "Price range"}
                            value={priceRange}
                            onChange={(
                              e: Event,
                              newValue: number | number[]
                            ) => {
                              if (rangeRef != null) {
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
                          <p className="font-medium">
                            {priceRange[0] * factorPrice}e
                          </p>
                          &nbsp;to&nbsp;
                          <p className="font-medium">
                            {priceRange[1] * factorPrice}e
                          </p>
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
            <div className="flex flex-col ">
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
                  />
                );
              })}
            </div>
          </section>

          <div className="flex flex-col items-center justify-center">
            {filteredArr && filteredArr.length > 0 && (
              <Map2 arrLoc={filteredArr} />
            )}
            {filteredArr.length}
          </div>
          {filteredArr && filteredArr.length == 0 && (
            <div className="text-center">**No search results**</div>
          )}
        </div>
      </Layout>
    );
  else
    return (
      <>
        <ErrorPage />
      </>
    );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const queryUrl = context.query;
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid, email } = token;

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
    // const qs44: string[] = [];
    // const qs33: string[] = [];

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
      var doc = r[index];
      numPropertiesLocation = 1 + numPropertiesLocation;
      sumPricesPropertiesLocation =
        sumPricesPropertiesLocation + doc.data().pricePerNight;
      if (
        rooms &&
        numOfGuests &&
        doc.data().numOfPersons >= numOfGuests &&
        doc.data().numOfRooms >= rooms
      ) {
        const isAv = await isAvailable(fromDate, toDate, doc.id);
        if (isAv) {
          arr.push(doc.data());
        }
      }
    }

    return {
      props: {
        uid: uid,
        location,
        // fromDateJSON: JSON.stringify(fromDate),
        // toDateJSON: JSON.stringify(toDate),
        fromStr: from,
        toStr: to,
        rooms,
        numOfGuests,
        numPropertiesLocation,
        sumPricesPropertiesLocation,
        ppp: JSON.stringify(arr), //mozda json stringify JSON.stringify(arr),
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/",
      },
      props: [],
    };
    // context.res.writeHead(302, { location: "/" });
    // context.res.end();
    // return { props: [] };
  }
};
