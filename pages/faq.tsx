import Layout from "../components/layout";
export default function Faq() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-8 sm:px-16  ">
        <div className="pt-7 pb-5 text-center text-3xl font-bold">FAQ</div>
        <div className="card  bg-base-100 shadow-md mb-10">
          <div className="card-body">
            <h2 className="card-title">
              Can I get extra beds/cots for child(ren)?
            </h2>
            <div>
              It depends on the property’s policy. Typically, additional costs
              for children (including extra beds/cots) are not included in the
              price and are added to your bill upon arival.
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-md  mb-10">
          <div className="card-body">
            <h2 className="card-title">
              Can I change the guest name for this booking?
            </h2>
            <div>
              It’s not possible to change any personal details like the guest
              name or email address.
            </div>
          </div>
        </div>
        <div className="card  bg-base-100 shadow-md  mb-10">
          <div className="card-body">
            <h2 className="card-title">Can I cancel my booking?</h2>
            <div>All bookings are non-refundable so you cannot cancel. </div>
          </div>
        </div>
        <div className="card  bg-base-100 shadow-md  mb-10">
          <div className="card-body">
            <h2 className="card-title">Are meals included in my booking?</h2>
            <div>
              In the property descrition will list if any meals are included or
              not included. Depending on the property it may be possible to add
              a meal plan upon arrival.
            </div>
          </div>
        </div>

        <div className="card  bg-base-100 shadow-md mb-10">
          <div className="card-body">
            <h2 className="card-title">
              What kinds of photos should I upload?
            </h2>
            <div>
              When you sign up, we ask you to upload photos of your space. This
              is because we know our guests love browsing through photos when
              looking for a place to stay. We recommend that you upload photos
              that showcase both the inside and the outside of your property.
              They don’t need to be professional photos – photos with a
              smartphone will still give your guests a good impression of the
              space.
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-md  mb-10">
          <div className="card-body">
            <h2 className="card-title">
              What happens if my property is damaged by a guest?
            </h2>
            <div>
              Property owners can request damage deposits from guests. Deposits
              help cover any potential damage caused by a guest, offering some
              reassurance that your property will be treated respectfully. If
              anything goes wrong, it can be reported to our team through our
              misconduct reporting feature.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
