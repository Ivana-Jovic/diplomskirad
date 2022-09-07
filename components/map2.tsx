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
  // const [mm, setMm] = useState<QueryDocumentSnapshot<DocumentData>[]>(arrLoc);
  const router = useRouter();
  useEffect(() => {
    getMinLng();
    const divs = arrLoc.map((elem) => {
      const popupDiv = document.createElement("div");
      //
      const root = ReactDOM.createRoot(popupDiv);
      // root.render(popup);
      root.render(
        <div
          className="bg-red-100 w-44"
          onClick={() =>
            // router.push({
            //   pathname: "/propertypage",
            //   query: {
            //     property: elem.id,
            //   },
            // })
            {
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
            }
          }
        >
          <CardPopup property={elem} />
        </div>
      );
      return popupDiv;
    });

    const initMap = async () => {
      const tt = await import("@tomtom-international/web-sdk-maps");
      // var center: tt.LngLatLike = [
      //   arrLoc && arrLoc[0] && arrLoc[0].loc && arrLoc[0].loc !== ","
      //     ? JSON.parse(arrLoc[0].loc.split("-")[0])
      //     : 20.447,
      //   arrLoc && arrLoc[0] && arrLoc[0].loc && arrLoc[0].loc !== ","
      //     ? JSON.parse(arrLoc[0].loc.split("-")[1])
      //     : 44.81,
      // ];
      // [20.4609, 44.81647189463462];
      var popup = new tt.Popup({
        offset: 35,
      });
      // .setDOMContent(popupDiv);

      const ivaninaMapa = tt.map({
        key: process.env.NEXT_PUBLIC_TOMTOM,
        container: mapElement.current,
        // center: center,
        zoom: 12,
        // dragPan: !isMobileOrTablet(),
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
      ///////////
      // var marker = new tt.Marker({
      //   draggable: true,
      // })
      //   .setLngLat(center)
      //   .addTo(ivaninaMapa);
      // function onDragEnd() {
      //   var lngLat = marker.getLngLat();
      //   lngLat = new tt.LngLat(
      //     // roundLatLng(lngLat.lng),
      //     // roundLatLng(lngLat.lat)
      //     lngLat.lng,
      //     lngLat.lat
      //   );
      //   popup.setHTML(lngLat.toString());
      //   popup.setLngLat(lngLat);
      //   marker.setPopup(popup);
      //   marker.togglePopup();
      //   // setLoc(lngLat.lng + "-" + lngLat.lat);
      // }
      // marker.on("dragend", onDragEnd);
      // /////
      function createMarker(
        icon,
        position: tt.LngLatLike,
        color,
        popupText,
        element,
        popupMarker
      ) {
        // const markerElement: HTMLDivElement = document.createElement("div");
        // markerElement.className = "marker";
        // const markerContentElement: HTMLDivElement =
        //   document.createElement("div");
        // markerContentElement.className = "marker-content";
        // markerContentElement.style.backgroundColor = color;
        // markerElement.appendChild(markerContentElement);
        // const iconElement: HTMLDivElement = document.createElement("div");
        // iconElement.className = "marker-icon";
        // iconElement.style.backgroundImage = "url('/images/banner.jpg')";

        // markerContentElement.appendChild(iconElement);
        const popup = new tt.Popup({ offset: { bottom: [0, -30] } })
          // .setText(popupText)
          // .setHTML("<p>title:</p><p>" + popupText + "</p>");
          .setDOMContent(popupMarker);
        //   .on("click", (param) => {
        //     console.log("...............");
        //     router.push({
        //       pathname: "/propertypage",
        //       query: {
        //         property: element.id,
        //       },
        //     });
        //   });
        // add marker to map
        new tt.Marker()
          // { anchor: "bottom" }!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          // new tt.Marker({ element: markerElement, anchor: "bottom" })
          .setLngLat(position)
          .setPopup(popup)
          .addTo(ivaninaMapa);
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

      //////
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
  return <div ref={mapElement} className="w-full h-full"></div>; //w-full h-96
};

export default Map2;
