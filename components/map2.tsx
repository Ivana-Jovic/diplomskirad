import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const Map2 = ({
  setLoc,
  arrLoc,
}: {
  setLoc: any;
  arrLoc: QueryDocumentSnapshot<DocumentData>[];
}) => {
  const mapElement = useRef();
  const [map, setMap] = useState<tt.Map>();

  const router = useRouter();
  useEffect(() => {
    const initMap = async () => {
      const tt = await import("@tomtom-international/web-sdk-maps");
      var center: tt.LngLatLike = [20.4609, 44.81647189463462];
      var popup = new tt.Popup({
        offset: 35,
      });

      const ivaninaMapa = tt.map({
        key: "g1vbv71TIZn39gozG2KycjVd1AuWJ9TC",
        container: mapElement.current,
        center: center,
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
      var marker = new tt.Marker({
        draggable: true,
      })
        .setLngLat(center)
        .addTo(ivaninaMapa);
      function onDragEnd() {
        var lngLat = marker.getLngLat();
        lngLat = new tt.LngLat(
          // roundLatLng(lngLat.lng),
          // roundLatLng(lngLat.lat)
          lngLat.lng,
          lngLat.lat
        );
        popup.setHTML(lngLat.toString());
        popup.setLngLat(lngLat);
        marker.setPopup(popup);
        marker.togglePopup();
        // setLoc(lngLat.lng + "-" + lngLat.lat);
      }
      marker.on("dragend", onDragEnd);
      // /////
      function createMarker(
        icon,
        position: tt.LngLatLike,
        color,
        popupText,
        element
      ) {
        const markerElement: HTMLDivElement = document.createElement("div");
        markerElement.className = "marker";
        const markerContentElement: HTMLDivElement =
          document.createElement("div");
        markerContentElement.className = "marker-content";
        markerContentElement.style.backgroundColor = color;
        markerElement.appendChild(markerContentElement);
        const iconElement: HTMLDivElement = document.createElement("div");
        iconElement.className = "marker-icon";
        iconElement.style.backgroundImage = "url('/images/banner.jpg')";

        markerContentElement.appendChild(iconElement);
        const popup = new tt.Popup({ offset: 30 })
          .setText(popupText)
          .setHTML("<p>title:</p><p>" + popupText + "</p>");
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
        new tt.Marker({ anchor: "bottom" })
          // new tt.Marker({ element: markerElement, anchor: "bottom" })
          .setLngLat(position)
          .setPopup(popup)
          .addTo(ivaninaMapa);
      }
      ivaninaMapa.on("load", (param) => {
        // const marker = new tt.Marker().setLngLat(center).addTo(ivaninaMapa);
        // createMarker(
        //   "accident.colors-white.svg",
        //   [20.47222965087945, 44.81877],
        //   "#5327c3",
        //   "SVG icon"
        // );
        // createMarker(
        //   "accident.colors-white.png",
        //   [20.4689, 44.822],
        //   "#c30b82",
        //   "PNG icon"
        // );
        // createMarker(
        //   "accident.colors-white.jpg",
        //   [20.45729511, 44.8083064467661],
        //   "#c31a26",
        //   "JPG icon"
        // );
        console.log("BBBBBBBBBBBB", arrLoc.length);
        arrLoc.forEach((element) => {
          console.log("UUUUUUUUU");
          createMarker(
            "accident.colors-white.jpg",
            [
              element.data().loc
                ? JSON.parse(element.data().loc.split("-")[0])
                : 20.447,
              element.data().loc
                ? JSON.parse(element.data().loc.split("-")[1])
                : 44.81,
            ],
            "#c31a26",
            element.data().title,
            element
          );
        });
      });

      //////
      setMap(ivaninaMapa);
    };
    initMap();
    return () => map?.remove();
  }, []);
  return <div ref={mapElement} className="w-full h-96"></div>;
};

export default Map2;
