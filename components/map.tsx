import { useEffect, useRef, useState } from "react";

const Map = ({ setLoc }: { setLoc: any }) => {
  const mapElement = useRef();
  const [map, setMap] = useState<tt.Map>();
  useEffect(() => {
    const initMap = async () => {
      const tt = await import("@tomtom-international/web-sdk-maps");
      // const tt1=  await import('@tomtom-international/web-sdk-services')
      ///
      var center: tt.LngLatLike = [20.4609, 44.81647189463462];
      var popup = new tt.Popup({
        offset: 35,
      });
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
      // function ReverseGeocode() {
      //   // this.errorHint = new InfoHint('error', 'bottom-center', 3000)
      //   //     .addTo(ivaninaMapa);
      //   // this.loadingHint = new InfoHint('info', 'bottom-center', 3000)
      //   //     .addTo(ivaninaMapa);
      //   this.isRequesting = false;
      //   this.clickPosition = null;
      //   this.marker = null;
      //   this.popup = new tt.Popup({ className: "tt-popup" })
      //     .setHTML("Click anywhere on the map to get position.")
      //     .setLngLat(new tt.LngLat(4.3705, 50.8515))
      //     .addTo(ivaninaMapa);
      //   map.on("click", this.handleMapClick.bind(this));
      // }
      // ReverseGeocode.prototype.handleResponse = function (response) {
      //   this.errorHint.hide();
      //   var result = response.addresses[0];
      //   var popupAddress = document.createElement("strong");
      //   if (result && result.address.freeformAddress) {
      //     popupAddress.innerText = result.address.freeformAddress;
      //   } else {
      //     popupAddress.innerText = "No address";
      //   }
      //   var popupContent = document.createElement("div");
      //   popupContent.appendChild(popupAddress);
      //   this.setPopup(this.clickPosition);
      //   this.popup.setDOMContent(popupContent);
      //   this.loadingHint.hide();
      // };
      // ReverseGeocode.prototype.setPopup = function (lnglat) {
      //   this.popup = new tt.Popup({ offset: [0, -30] }).setLngLat(
      //     new tt.LngLat(lnglat[0], lnglat[1])
      //   );
      //   this.marker = new tt.Marker().setLngLat(
      //     new tt.LngLat(lnglat[0], lnglat[1])
      //   );
      //   this.marker.getElement().classList.add("marker");
      //   this.marker.addTo(ivaninaMapa);
      //   this.marker.setPopup(this.popup);
      //   this.marker.togglePopup();
      // };
      // ReverseGeocode.prototype.removePopup = function () {
      //   if (this.marker && this.popup) {
      //     this.marker.remove();
      //     this.marker = null;
      //     this.popup.remove();
      //     this.popup = null;
      //   }
      // };
      // ReverseGeocode.prototype.handleMapClick = function (event) {
      //   // if (DomHelpers.checkIfElementOrItsParentsHaveClass(event.originalEvent.target, 'marker')) {
      //   //     return;
      //   // }
      //   this.loadingHint.setMessage("Loading");
      //   this.clickPosition = event.lngLat.toArray();
      //   // ivaninaMapa.panTo(this.clickPosition);
      //   this.errorHint.hide();
      //   this.removePopup();
      //   if (this.isRequesting) {
      //     return;
      //   }
      //   this.isRequesting = true;
      //   tt.services
      //     .reverseGeocode({
      //       key: "g1vbv71TIZn39gozG2KycjVd1AuWJ9TC",
      //       position: this.clickPosition,
      //       language: "en-GB",
      //     })
      //     .then(this.handleResponse.bind(this))
      //     .catch(
      //       function (error) {
      //         this.loadingHint.hide();
      //         this.errorHint.setMessage(
      //           error.data ? error.data.errorText : error
      //         );
      //       }.bind(this)
      //     )
      //     .finally(
      //       function () {
      //         this.isRequesting = false;
      //       }.bind(this)
      //     );
      // };
      // new ReverseGeocode();
      ////
      // ````````````````````````````````

      //////
      setMap(ivaninaMapa);
    };
    initMap();
    return () => map?.remove();
  }, []);
  return <div ref={mapElement} className="w-96 h-96"></div>;
};

export default Map;
