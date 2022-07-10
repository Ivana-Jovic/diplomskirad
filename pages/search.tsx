import { useRouter } from "next/router";
import CardSearch from "../components/cardsearch";
import Layout from "../components/layout";
const arrData = [
  {
    name: "MON",
    description: "blabla",
    price: "100",
    image: "/images/app1.jpg",
    stars: "5",
  },
  {
    name: "MON2",
    description: "blabla",
    price: "100",
    image: "/images/app2.jpg",
    stars: "5",
  },
  {
    name: "MON3",
    description: "blabla",
    price: "100",
    image: "/images/app3.jpg",
    stars: "5",
  },
  {
    name: "MON4",
    description: "blabla",
    price: "100",
    image: "/images/profile.jpg",
    stars: "5",
  },
  {
    name: "MON5",
    description: "blabla",
    price: "100",
    image: "/images/banner.jpg",
    stars: "5",
  },
];
//PROMENI KEY!!!
export default function Search() {
  const router = useRouter();
  const { location, numOfGuests } = router.query;
  return (
    <Layout placeholder={location + " | " + numOfGuests + " guests"}>
      {/* <div> */}
      {/* <Navbar placeholder={location + " | " + numOfGuests + " guests"} /> */}
      {/* | $(numOfGuests) */}
      <div className=" flex">
        <section className="  px-10 py-10 w-full ">
          {/* flexgrow */}
          <p className="text-sm">
            Stay in {location} from to - {numOfGuests} guests
          </p>
          <p className="text-4xl mb-6">Stays in {location}</p>
          {/* dodati burger  ya telefone */}
          <div className="hidden sm:inline-flex mb-5 space-x-3 text-gray-800">
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">more</p>
          </div>
          <div className="flex flex-col ">
            {arrData.map(({ name, description, image, price, stars }) => {
              return (
                <CardSearch
                  key={image}
                  name={name}
                  description={description}
                  image={image}
                  price={price}
                  stars={stars}
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
