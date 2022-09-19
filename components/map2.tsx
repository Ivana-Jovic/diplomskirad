import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import SearchBox from "@tomtom-international/web-sdk-plugin-searchbox";
import { services } from "@tomtom-international/web-sdk-services";
import * as ReactDOM from "react-dom/client";
import CardPopup from "./cardpopup";

interface props {
  popup?: React.ReactNode;
  arrLoc: DocumentData[];
}

const Map2 = (props: props) => {
  const { popup, arrLoc } = props;
  const mapElement = useRef();
  const [map, setMap] = useState<tt.Map>();
  var lngArr = [];
  var latArr = [];
  var maxLng = null;
  var minLng = null;
  var minLat = null;
  var maxLat = null;
  function getMinLng() {
    arrLoc.forEach((element, index) => {
      lngArr.push(element.loc.split("-")[0]);
      latArr.push(element.loc.split("-")[1]);
    });
    maxLng = Math.max(...lngArr);
    minLng = Math.min(...lngArr);
    minLat = Math.min(...latArr);
    maxLat = Math.max(...latArr);
  }
  const router = useRouter();
  useEffect(() => {
    getMinLng();
    const divs = arrLoc.map((elem) => {
      const popupDiv = document.createElement("div");
      const root = ReactDOM.createRoot(popupDiv);
      root.render(
        <div
          className="bg-red-100 w-44"
          onClick={() => {
            if (router && router.pathname === "/search") {
              router.push({
                pathname: "/propertypage",
                query: {
                  property: elem.id,
                  from: router.query.from,
                  numOfGuests: router.query.numOfGuests,
                  to: router.query.to,
                },
              });
            } else {
              router.push({
                pathname: "/propertypage",
                query: {
                  property: elem.id,
                },
              });
            }
          }}
        >
          <CardPopup property={elem} />
        </div>
      );
      return popupDiv;
    });

    const initMap = async () => {
      const tt = await import("@tomtom-international/web-sdk-maps");
      var popup = new tt.Popup({
        offset: 35,
      });

      const ivaninaMapa = tt.map({
        key: process.env.NEXT_PUBLIC_TOMTOM,
        container: mapElement.current,
        zoom: 12,
      });
      ivaninaMapa.addControl(
        new tt.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: false,
        }).on("geolocate", (e: any) => {
          console.log(e);
        })
      );
      ivaninaMapa.on("click", (param) => {
        const marker = new tt.Marker()
          .setLngLat([param.lngLat.lat, param.lngLat.lng])
          .addTo(ivaninaMapa);
      });
      ivaninaMapa.addControl(new tt.NavigationControl());

      function createMarker(
        icon,
        position: tt.LngLatLike,
        color,
        popupText,
        element,
        popupMarker
      ) {
        const popup = new tt.Popup({
          offset: { bottom: [0, -30] },
        }).setDOMContent(popupMarker);

        new tt.Marker().setLngLat(position).setPopup(popup).addTo(ivaninaMapa);
      }
      console.log("PPPPP", arrLoc.length);
      ivaninaMapa.on("load", (param) => {
        console.log("BBBBBBBBBBBB", arrLoc.length);
        arrLoc.forEach((element, index) => {
          console.log("UUUUUUUUU", element.title);
          createMarker(
            "accident.colors-white.jpg",
            [
              element.loc && element.loc !== ","
                ? JSON.parse(element.loc.split("-")[0])
                : 20.447,
              element.loc && element.loc !== ","
                ? JSON.parse(element.loc.split("-")[1])
                : 44.81,
            ],
            "#c31a26",
            element.title,
            element,
            divs[index]
          );
        });
      });

      const bounds = new tt.LngLatBounds([minLng, minLat], [maxLng, maxLat]);
      ivaninaMapa.fitBounds(bounds, {
        padding: 35,
        maxZoom: 13,
        duration: 1000,
      });
      setMap(ivaninaMapa);
    };
    initMap();
    return () => map?.remove();
  }, [arrLoc]);
  return <div ref={mapElement} className="w-full h-full"></div>;
};

export default Map2;
