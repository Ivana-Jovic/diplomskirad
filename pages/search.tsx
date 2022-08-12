import {
  Box,
  Chip,
  Popover,
  Rating,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import * as React from "react";
import { Console } from "console";
import { previousDay } from "date-fns";
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
//TODO: dodati datume u search i ostale
function valuetext(value: number) {
  return `${value}°C`;
}
//PROMENI KEY!!!
async function isAvailable(from: Date, to: Date, propertyId: string) {
  const querySnapshot6 = await getDocs(
    query(
      collection(db, "reservations"),
      where("propertyId", "==", propertyId)
      //TODO: change from and to to DATE types in db!!!! and remove condition from if clause
      // where("to" as Date, ">", from) //= means they are checkig out the same day others are checking in which is ok
    )
  );
  for (let index = 0; index < querySnapshot6.docs.length; index++) {
    const doc = querySnapshot6.docs[index];
    console.log("KK ", propertyId, index, doc.id);

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
  const { location, from, to } = router.query; //,rooms,numOfGuests, from, to
  const fromDate = new Date(router.query.from as string);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(router.query.to as string);
  toDate.setHours(0, 0, 0, 0);

  const rooms = (router.query.rooms ?? 0) as number;
  // router.query.rooms ? +router.query.rooms : undefined;
  const numOfGuests = (router.query.numOfGuests ?? 0) as number;
  // ? +router.query.numOfGuests
  // : undefined;
  const [arr, setArr] = useState<any[]>([]);
  const [filteredArr, setFilteredArr] = useState<any[]>([]);

  const [selectedSuperhost, setSelectedSuperhost] = useState<boolean>(false);
  const [selectedRatingFourAndUp, setSelectedRatingFourAndUp] =
    useState<boolean>(false);
  const [selectedGarage, setSelectedGarage] = useState<boolean>(false);
  const [selectedPrice, setSelectedPrice] = useState<boolean>(false);
  const [sortPrice, setSortPrice] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([1, 100]); //put max when adding property
  const factorPrice = 10;
  const getSearchProperties = async () => {
    console.log("in search gethostproperty");
    const qs44: string[] = [];
    const qs33: string[] = [];

    const arrData: any[] = [];

    const querySnapshot1 = await getDocs(
      query(collection(db, "property"), where("city", "==", location))
    );

    const querySnapshot2 = await getDocs(
      query(collection(db, "property"), where("state", "==", location))
    );
    // const querySnapshot3 = await getDocs(
    //   query(
    //     collection(db, "property"),
    //     where("numOfPersons", ">=", numOfGuests)
    //   )
    // );
    // const querySnapshot4 = await getDocs(
    //   query(collection(db, "property"), where("numOfRooms", ">=", rooms))
    // );

    // querySnapshot4.docs.forEach((doc) => {
    //   qs44.push(doc.id);
    //   console.log("/", doc.id);
    // });
    // querySnapshot3.docs.forEach((doc) => {
    //   qs33.push(doc.id);
    //   console.log("//", doc.id);
    // });

    let r: QueryDocumentSnapshot<DocumentData>[] = querySnapshot1.docs.concat(
      querySnapshot2.docs
    );
    //UNIJA
    setNumPropertiesLocation(0);
    setSumPricesPropertiesLocation(0);
    r.forEach(async (doc) => {
      // console.log()
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
            arrData.push(doc.id + "---" + JSON.stringify(doc.data()));
            // setArr(arrData);
            setArr((prev) => {
              return [...prev, doc.id + "---" + JSON.stringify(doc.data())];
            });
            setFilteredArr((prev) => {
              return [...prev, doc.id + "---" + JSON.stringify(doc.data())];
            });
            console.log("MAIN2", fromDate, toDate, doc.id, arrData.length, arr);
          }
        });
      }

      //PRESEK
      // console.log("unutra");
      // console.log("4- " + querySnapshot4.docs[0].id);
      // console.log("4+ " + doc.id);

      // console.log('"', qs44?.length);

      ///// DATUMI
      // const querySnapshot5 = await getDocs(
      //   query(collection(db, "reservations"), where("propertyId", "==", doc.id),
      //   where("resFrom",">=",fromDate))
      // );

      // if (qs33?.includes(doc.id) && qs44?.includes(doc.id)) {
      // console.log("sadrzi");
      // arrData.push(doc.id + "---" + JSON.stringify(doc.data()));
      // setArr(arrData);
      // }
    });
  };
  //, [location, numOfGuests, rooms]);

  const shouldBeShown = (selected: boolean, is: boolean) => {
    if ((selected && is) || !selected) {
      console.log("shouldBeShown TRUE");
      return true;
    } else {
      console.log("shouldBeShown FALSE", selected, is);
      return false;
    }
  };
  const filterProperties = (item: any) => {
    const property = JSON.parse(item.split("---")[1]);
    const propertyid = item.split("---")[0];
    //if selectedSuperhost and isSuperhost
    // or !selectedSuperhost   -> SHOULD BE SHOWN
    console.log(
      "PRICE",
      property.pricePerNight,
      priceRange[0] * factorPrice,
      priceRange[1] * factorPrice
    );
    if (
      shouldBeShown(selectedSuperhost, property.isSuperhost) &&
      shouldBeShown(
        selectedRatingFourAndUp,
        property.totalStars / property.numberOfReviews >= 4
      ) &&
      shouldBeShown(selectedGarage, property.garage) &&
      //TODO: namestiti da je 2000 max za noc u bazi
      shouldBeShown(
        true,
        priceRange[0] * factorPrice <= property.pricePerNight &&
          priceRange[1] * factorPrice >= property.pricePerNight
      )
    ) {
      console.log("TRUE", sortPrice);
      return true;
    }

    console.log("FALSE", selectedSuperhost, property.isSuperhost);
    return false;
  };

  useEffect(() => {
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
      // getSearchProperties().then(() => {
      // const arrData5: any[] = filteredArr.filter(filterProperties);
      setFilteredArr((prev) => [...prev].filter(filterProperties));
      if (sortPrice == "asc") {
        console.log("ASC");
        setFilteredArr((prev) =>
          [...prev]
            .slice() //Shallow copy :https://stackoverflow.com/questions/67122915/sort-method-is-not-working-with-usestate-in-react
            .sort(
              (a: any, b: any) =>
                JSON.parse(a.split("---")[1]).pricePerNight -
                JSON.parse(b.split("---")[1]).pricePerNight
            )
        );
      } else if (sortPrice == "desc") {
        console.log("DESC");
        setFilteredArr((prev) =>
          [...prev]
            .slice() //Shallow copy :https://stackoverflow.com/questions/67122915/sort-method-is-not-working-with-usestate-in-react
            .sort(
              (a: any, b: any) =>
                JSON.parse(b.split("---")[1]).pricePerNight -
                JSON.parse(a.split("---")[1]).pricePerNight
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
      <div className=" flex max-w-7xl mx-auto px-8 sm:px-16">
        <section className="  px-10 py-10 w-full ">
          {/* flexgrow */}
          <p className="text-sm pb-5">
            Stay in {location} <br />
            from {from} to {to} <br />
            {numOfGuests} guests - {rooms} rooms <br />
            Average price per night in {location} is{" "}
            {sumPricesPropertiesLocation / numPropertiesLocation}e
          </p>
          <p className="text-4xl mb-6">Stays in {location}</p>
          {/* dodati burger  ya telefone */}
          {/* hidden sm:inline-flex */}
          <div className="flex mb-5 space-x-3 text-gray-800">
            {/* <p className="buttonfilter flex items-center">
              <Rating name="read-only" value={4} readOnly size="small" /> & up
            </p> */}
            <Chip
              icon={<Rating name="read-only" value={4} readOnly size="small" />}
              label="& up"
              variant={selectedRatingFourAndUp ? "filled" : "outlined"}
              onClick={() => {
                setSelectedRatingFourAndUp(!selectedRatingFourAndUp);
              }}
            />
            {/* <p className="buttonfilter">Price</p> */}
            <Chip
              label="Price"
              variant={selectedPrice ? "filled" : "outlined"}
              onClick={(event: any) => {
                // setSelectedPrice(!selectedPrice);
                setAnchorEl(event.currentTarget);
              }}
            />
            {
              <Popover
                id={Boolean(anchorEl) ? "simple-popover" : undefined}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => {
                  setAnchorEl(null);
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div className="m-7 mt-10 flex flex-col items-center">
                  <Box sx={{ width: 300 }}>
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
                      {/* TODO: sta su aria label */}
                      Sort ascending
                    </ToggleButton>
                    <ToggleButton value="desc" aria-label="desc">
                      Sort descending
                    </ToggleButton>
                  </StyledToggleButtonGroup>
                  {/* sortPrice:{sortPrice ?? "none"} */}
                </div>
              </Popover>
            }
            {/* <p className="buttonfilter">Garage</p> */}
            <Chip
              label="Garage"
              variant={selectedGarage ? "filled" : "outlined"}
              onClick={() => {
                setSelectedGarage(!selectedGarage);
              }}
            />
            {/* <p className="buttonfilter">Superhost</p> */}
            <Chip
              label="Superhost"
              variant={selectedSuperhost ? "filled" : "outlined"}
              onClick={() => {
                setSelectedSuperhost(!selectedSuperhost);
              }}
            />

            {/* <p className="buttonfilter">more</p> */}
          </div>
          <div className="flex flex-col ">
            {filteredArr.map((item) => {
              const property = JSON.parse(item.split("---")[1]);
              const propertyid = item.split("---")[0];
              return (
                <CardSearch
                  key={propertyid}
                  propertyid={propertyid}
                  name={property.title}
                  description={property.description}
                  image={property.images[0]}
                  price={property.pricePerNight}
                  // stars="5"
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
      </div>
    </Layout>
    // {/* </div> */}
  );
}
// export async function getServerSideProps(params: type) {
//   // const searchresults= await fetch(...).then(res.....)
// }
