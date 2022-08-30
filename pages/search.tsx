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
import { useEffect, useState, useCallback, useRef, MouseEvent } from "react";
import CardSearch from "../components/cardsearch";
import Layout from "../components/layout";
import { db } from "../firebase";
import { styled } from "@mui/material/styles";
import Map2 from "../components/map2";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import { useCollectionData } from "react-firebase-hooks/firestore";

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
//PROMENI KEY!!!
async function isAvailable(from: Date, to: Date, propertyId: string) {
  const querySnapshot6 = await getDocs(
    query(collection(db, "reservations"), where("propertyId", "==", propertyId))
  );
  for (let index = 0; index < querySnapshot6.docs.length; index++) {
    const doc = querySnapshot6.docs[index];
    //oni koji se potencijalno poklapaju
    if (new Date(doc.data().to) <= from || new Date(doc.data().from) >= to) {
      //ne poklapaju se
    } else {
      //poklapaju se kako god
      //ako je doc.to izmedju to i from poklapaju se sigurno
      //ako doc.to vece od to poklapaju se  ako je from iymedju ili pre from
      //
      console.log(
        "ELSE GRANA",
        propertyId,
        from.toDateString(),
        to.toDateString()
      );
      return false;
    }
  }
  return true;
}
export default function Search() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [numPropertiesLocation, setNumPropertiesLocation] = useState<number>(0);
  const [sumPricesPropertiesLocation, setSumPricesPropertiesLocation] =
    useState<number>(0);
  const router = useRouter();
  const { location: locationQuery, from, to } = router.query;
  const location: string = locationQuery
    ? locationQuery.includes(", ")
      ? (locationQuery as string).split(", ")[0]
      : (locationQuery as string)
    : "";
  const fromDate = new Date(router.query.from as string);
  const toDate = new Date(router.query.to as string);
  const rooms = (router.query.rooms ?? 0) as number;
  const numOfGuests = (router.query.numOfGuests ?? 0) as number;
  const [arr, setArr] = useState<any[]>([]);
  const [filteredArr, setFilteredArr] = useState<any[]>([]);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [selectedSuperhost, setSelectedSuperhost] = useState<boolean>(false);
  const [selectedRatingFourAndUp, setSelectedRatingFourAndUp] =
    useState<boolean>(false);
  const [selectedGarage, setSelectedGarage] = useState<boolean>(false);
  const [selectedPrice, setSelectedPrice] = useState<boolean>(false);
  const [sortPrice, setSortPrice] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]); //put max when adding property
  const factorPrice = 10;

  const getSearchProperties = async () => {
    console.log("in search gethostproperty");
    const qs44: string[] = [];
    const qs33: string[] = [];

    const querySnapshot1 = await getDocs(
      query(collection(db, "property"), where("city", "==", location))
    );

    const querySnapshot2 = await getDocs(
      query(collection(db, "property"), where("state", "==", location))
    );
    setFilteredArr([]);
    setArr([]);
    let r: QueryDocumentSnapshot<DocumentData>[] = querySnapshot1.docs.concat(
      querySnapshot2.docs
    );
    //UNIJA
    setNumPropertiesLocation(0);
    setSumPricesPropertiesLocation(0);
    r.forEach(async (doc) => {
      setNumPropertiesLocation((prev) => prev + 1);
      setSumPricesPropertiesLocation((prev) => prev + doc.data().pricePerNight);
      if (
        rooms &&
        numOfGuests &&
        doc.data().numOfPersons >= numOfGuests &&
        doc.data().numOfRooms >= rooms
      ) {
        console.log("MAIN", fromDate, toDate);
        isAvailable(fromDate, toDate, doc.id).then((isAv) => {
          if (isAv) {
            setArr((prev) => {
              return [...prev, doc];
            });
            setFilteredArr((prev) => {
              return [...prev, doc];
            });
          }
        });
      }
    });
  };

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
  const filterProperties = (item: any) => {
    const property = item.data();
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
    if (firstLoad) {
      setArr([]);
      setFilteredArr([]);
    }
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
              (a: any, b: any) =>
                a.data().pricePerNight - b.data().pricePerNight
            )
        );
      } else if (sortPrice == "desc") {
        console.log("DESC");
        setFilteredArr((prev) =>
          [...prev]
            .slice() //Shallow copy :https://stackoverflow.com/questions/67122915/sort-method-is-not-working-with-usestate-in-react
            .sort(
              (a: any, b: any) =>
                b.data().pricePerNight - a.data().pricePerNight
            )
        );
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
  ]); //TODO proveriti sve useeffect nizove

  useEffect(() => {
    setArr([]);
    setFilteredArr([]);
    if (
      location != undefined &&
      rooms != undefined &&
      numOfGuests != undefined &&
      fromDate != undefined &&
      toDate != undefined &&
      rooms &&
      location &&
      numOfGuests &&
      fromDate &&
      toDate
    ) {
      setFirstLoad(false);
      setArr([]);
      setFilteredArr([]);
      getSearchProperties();
    }
  }, [location, rooms, numOfGuests]);

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
            from {from} to {to} <br />
            {numOfGuests} guests - {rooms} rooms <br />
            Average price per night in {location} is{" "}
            {sumPricesPropertiesLocation / numPropertiesLocation}e
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
                    <div className="mt-10 flex flex-col w-52 hover:bg-inherit">
                      <Box sx={{ width: 300 }} className="w-52 sm:w-80">
                        <AirbnbSlider
                          getAriaLabel={() => "Price range"}
                          value={priceRange}
                          onChange={(e: Event, newValue: number | number[]) => {
                            setPriceRange(newValue as number[]);
                            setSelectedPrice(true);
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
              const property = item.data();
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
                />
              );
            })}
          </div>
        </section>

        <div className="flex flex-col items-center justify-center">
          {filteredArr.length > 0 && <Map2 setLoc={""} arrLoc={filteredArr} />}
          {filteredArr.length}
        </div>
      </div>
    </Layout>
  );
}
