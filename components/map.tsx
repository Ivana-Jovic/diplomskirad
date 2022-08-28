import { useEffect, useRef, useState } from "react";
import SearchBox from "@tomtom-international/web-sdk-plugin-searchbox";
import { services } from "@tomtom-international/web-sdk-services";
import * as ReactDOM from "react-dom/client";

interface props {
  setLoc: any;
  popup?: React.ReactNode;
}
const Map = (props: props) => {
  const { setLoc, popup } = props;
  const mapElement = useRef();
  const [map, setMap] = useState<tt.Map>();

  useEffect(() => {
    const popupDiv = document.createElement("div");
    //
    const root = ReactDOM.createRoot(popupDiv);
    root.render(popup);
    const initMap = async () => {
      const tt = await import("@tomtom-international/web-sdk-maps");
      // const SearchBox = await import(
      //   "@tomtom-international/web-sdk-plugin-searchbox"
      // );
      // const tt1=  await import('@tomtom-international/web-sdk-services')
      ///
      var center: tt.LngLatLike = [20.4609, 44.81647189463462];
      var popup = new tt.Popup({
        offset: 35,
      }).setDOMContent(popupDiv);
      // var roundLatLng = Formatters.roundLatLng;
      ///
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
        setLoc(lngLat.lng + "-" + lngLat.lat);
      }
      marker.on("dragend", onDragEnd);
      // /////

      //////
      setMap(ivaninaMapa);

      // const ttSearchBox = new SearchBox(services, {
      //   idleTimePress: 100,
      //   minNumberOfCharacters: 0,
      //   searchOptions: {
      //     key: "g1vbv71TIZn39gozG2KycjVd1AuWJ9TC",
      //     language: "en-GB",
      //   },
      //   autocompleteOptions: {
      //     key: "g1vbv71TIZn39gozG2KycjVd1AuWJ9TC",
      //     language: "en-GB",
      //   },
      //   noResultsMessage: "No results found.",
      // });
      // map.addControl(ttSearchBox, "top-left");
      // ttSearchBox.on("tomtom.searchbox.resultsfound", function (data) {
      //   console.log(data);
      // });
    };
    initMap();
    return () => map?.remove();
  }, []);
  return <div ref={mapElement} className="w-96 h-96"></div>;
};

export default Map;
