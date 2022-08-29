import { useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom/client";

interface props {
  setLoc: any;
  popup?: React.ReactNode;
  setState: any;
  setCity: any;
  setStreetName: any;
  setStreetNum: any;
  setSelectedStreet: any;
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

      ivaninaMapa.addControl(new tt.NavigationControl());
      var marker = new tt.Marker({});

      setMap(ivaninaMapa);

      const ttSearchBox = new SearchBox.default(services, {
        idleTimePress: 100,
        minNumberOfCharacters: 0,
        searchOptions: {
          key: "g1vbv71TIZn39gozG2KycjVd1AuWJ9TC",
          language: "en-GB",
          // idxSet: "PAD,Addr",
        },
        autocompleteOptions: {
          key: "g1vbv71TIZn39gozG2KycjVd1AuWJ9TC",
          language: "en-GB",
        },

        noResultsMessage: "No results found.",
      });
      // ttSearchBox.setFilter({
      //   type: "category",
      //   value: {
      //     name: "Point Address",
      //     id: "9361",
      //   },
      // });
      ivaninaMapa.addControl(ttSearchBox, "top-left");

      ttSearchBox.on("tomtom.searchbox.resultselected", function (event: any) {
        setSelectedStreet(false);
        const t: any = event.data.result.type;
        if (t == "Point Address") {
          const bl: any = event.data.result.position;
          marker.setLngLat(bl).addTo(ivaninaMapa);
          ivaninaMapa.easeTo({ center: bl });
          var lngLat = marker.getLngLat();
          // setLoc(lngLat.lng + "-" + lngLat.lat);
          setLoc(
            event.data.result.position.lng +
              "-" +
              event.data.result.position.lat
          );
          setState(event.data.result.address.country);
          setCity(event.data.result.address.localName);
          // countrySecondarySubdivision);
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

// This option specifies indexes to use for the search. The predefined indexes are:
// Addr: Address range interpolation (when there is no PAD)
// Geo: Geographies
// PAD: Point Addresses
// POI: Points of interest
// Str: Streets
// Xstr: Cross Streets (intersections)
// Example
// // search Points Of Interest only
// tt.services.geometrySearch({
//   query: 'pizza',
//   idxSet: 'POI'
// }).then(handleResults);
// // search addresses only
// tt.services.geometrySearch()
// tt.services.geometrySearch({
//   query: 'pizza',
//   idxSet: 'PAD,Addr'
// }).then(handleResults);
