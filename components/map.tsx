import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom/client";

interface props {
  setLoc: Dispatch<SetStateAction<string>>;
  popup?: React.ReactNode;
  setState: Dispatch<SetStateAction<string>>;
  setCity: Dispatch<SetStateAction<string>>;
  setStreetName: Dispatch<SetStateAction<string>>;
  setStreetNum: Dispatch<SetStateAction<string>>;
  setSelectedStreet: Dispatch<SetStateAction<boolean>>;
}
const Map = (props: props) => {
  const {
    setLoc,
    popup,
    setState,
    setCity,
    setStreetName,
    setStreetNum,
    setSelectedStreet,
  } = props;
  const mapElement = useRef();
  const [map, setMap] = useState<tt.Map>();

  useEffect(() => {
    const initMap = async () => {
      const SearchBox = await import(
        "@tomtom-international/web-sdk-plugin-searchbox"
      );
      const tt = await import("@tomtom-international/web-sdk-maps");
      const { services } = await import(
        "@tomtom-international/web-sdk-services"
      );

      var center: tt.LngLatLike = [20.4609, 44.81647189463462];

      const ivaninaMapa = tt.map({
        key: process.env.NEXT_PUBLIC_TOMTOM,
        container: mapElement.current,
        center: center,
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

      ivaninaMapa.addControl(new tt.NavigationControl());
      var marker = new tt.Marker({});

      setMap(ivaninaMapa);

      const ttSearchBox = new SearchBox.default(services, {
        idleTimePress: 100,
        minNumberOfCharacters: 0,
        searchOptions: {
          key: process.env.NEXT_PUBLIC_TOMTOM,
          language: "en-GB",
        },
        autocompleteOptions: {
          key: process.env.NEXT_PUBLIC_TOMTOM,
          language: "en-GB",
        },

        noResultsMessage: "No results found.",
      });

      ivaninaMapa.addControl(ttSearchBox, "top-left");

      ttSearchBox.on("tomtom.searchbox.resultselected", function (event: any) {
        setSelectedStreet(false);
        const t: any = event.data.result.type;
        if (t === "Point Address") {
          const bl: any = event.data.result.position;
          marker.setLngLat(bl).addTo(ivaninaMapa);
          ivaninaMapa.easeTo({ center: bl });
          var lngLat = marker.getLngLat();
          setLoc(
            event.data.result.position.lng +
              "-" +
              event.data.result.position.lat
          );
          setState(event.data.result.address.country);
          setCity(event.data.result.address.localName);
          setStreetName(event.data.result.address.streetName);
          setStreetNum(event.data.result.address.streetNumber);
          setSelectedStreet(true);
        }
      });
    };

    initMap();

    return () => map?.remove();
  }, []);

  return <div ref={mapElement} className="w-full h-96"></div>;
};

export default Map;
