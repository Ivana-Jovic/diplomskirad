import Image from "next/image";
import {
  arrayRemove,
  arrayUnion,
  doc,
  DocumentData,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Layout from "../components/layout";
import { db } from "../firebase";
import { AuthContext } from "../firebase-authProvider";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { yellow, red } from "@mui/material/colors";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import Heart from "../components/heart";
import Banner from "../components/banner";
import TextField from "@mui/material/TextField";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { Dropdown, Menu, Space } from "antd";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Wierder from "../components/wierder";
import Extrawierd from "../components/extrawierd";

export default function PropertyPage() {
  const router = useRouter();
  const { property: propertyid } = router.query;
  // const { user, myUser } = useContext(AuthContext);
  const [property, setProperty] = useState<DocumentData>();
  // const [inFaves, setInFaves] = useState<boolean>(false);
  const getProperty = async () => {
    // const arrData: any[] = [];

    const pid: string = propertyid ? propertyid.toString() : "";
    const docSnap = await getDoc(doc(db, "property", pid));

    if (docSnap.exists()) {
      setProperty(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    if (propertyid) getProperty();
  }, [propertyid]); //probaj i property ako ne radi
  ////reservacije
  const [dateFrom, setDateFrom] = useState<Date | null>(new Date());
  const [dateTo, setDateTo] = useState<Date | null>(new Date());
  const [guests, setGuests] = useState<number>(1);
  const [rooms, setRooms] = useState<number>(1);

  const [visible, setVisible] = useState(false);

  return (
    <Layout>
      {property && (
        <div className="pt-7 font-semibold  flex flex-col max-w-7xl mx-auto px-8 sm:px-16">
          <div
            className="border shadow-md text-lg sm:text-2xl
                font-semibold rounded-lg  p-6 mb-2 text-center"
          >
            {property.title}
          </div>

          <div className="flex justify-between font-semibold ">
            <div className="flex space-x-4">
              <div>
                {property.stars}
                <StarOutlineRoundedIcon sx={{ fontSize: 18 }} />
              </div>
              <div>10 reviews</div>
              <div>
                {property.isSuperhost ? (
                  <>
                    <WorkspacePremiumRoundedIcon sx={{ fontSize: 18 }} />
                    Superhost
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div>
                {property.state}, {property.city}
              </div>
            </div>

            <Heart propertyid={propertyid ? propertyid[0] : ""} />
          </div>

          <div
            className="h-[300px] sm:h-[400px] lg:h-[500px] mt-2
    xl:h-[600px] 2xl:h-[600px] grid grid-cols-3 mb-5"
          >
            <div className="relative col-span-3 sm:col-span-2 row-span-2 mr-2">
              <Image
                src={property.images[0]}
                alt=""
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="relative mb-2 ml-2 hidden sm:inline-grid">
              <Image
                src={property.images[1]}
                alt=""
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="relative mt-2 ml-2 hidden sm:inline-grid">
              <Image
                src={property.images[2]}
                alt=""
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          </div>
          <div className="mb-5">
            {property.numOfPersons} guests · {property.numOfRooms} bedroom ·{" "}
            {property.type}
          </div>
          <div className="flex flex-col bg-grey-100 mb-10">
            <div
              className="border shadow-md text-lg sm:text-2xl
                font-semibold rounded-lg  p-6"
            >
              {property.description}
            </div>
            {/* {property.street}-{property.streetNum} */}
          </div>
          <div className="mb-10">Amenities</div>
          <div className="mb-10">REVIEWS</div>
          <div className="mb-10">MAP</div>
          <div className="mb-10">CALENDAR- RESERVE</div>
          <div className="bg-slate-100">
            <Extrawierd rese={true} property={property} />
            {/* //TODO: ograniciti dokle ide broj gostiju ili skloniti */}
          </div>
        </div>
      )}
    </Layout>
  );
}
