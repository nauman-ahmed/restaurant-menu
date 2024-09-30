

export default function Services() {
  return (
    <>
      {/* <!-- Services Section Start --> */}
      <section id="services" className="section">
        <div className="container">
          <div className="row">
            {/* <!-- Start Col --> */}
            <div className="col-lg-4 col-md-6 col-xs-12">
              <div className="services-item text-center">
                <div className="icon d-flex justify-content-center align-items-center">
                  <img src={"icons/cog.svg"} />
                </div>
                <h4>Seamless Configuration</h4>
                <p>
                  Tailor your software to meet your unique needs with just a few
                  clicks, ensuring optimal performance and user satisfaction.
                </p>
              </div>
            </div>
            {/* <!-- End Col --> */}
            {/* <!-- Start Col --> */}
            <div className="col-lg-4 col-md-6 col-xs-12">
              <div className="services-item text-center">
                <div className="icon d-flex justify-content-center align-items-center">
                  <img src={"icons/brush.svg"} />
                </div>
                <h4>Creative Design Excellence</h4>
                <p>
                  Unleash your brand’s potential with Slick’s expert design
                  services, crafting visually stunning and innovative designs to
                  captivate.
                </p>
              </div>
            </div>
            {/* <!-- End Col --> */}
            {/* <!-- Start Col --> */}
            <div className="col-lg-4 col-md-6 col-xs-12">
              <div className="services-item text-center">
                <div className="icon d-flex justify-content-center align-items-center">
                  <img src={"icons/heart.svg"} />
                </div>
                <h4>Passionate Craftsmanship</h4>
                <p>
                  Creating software with heart. Our dedication ensures every
                  project is crafted with precision, passion, and excellence.
                </p>
              </div>
            </div>
            {/* <!-- End Col --> */}
          </div>
        </div>
      </section>
      {/* <!-- Services Section End --> */}
        {/* <!-- Business Plan Section Start --> */}
        <section id="business-plan">
        <div className="container">
          <div className="row">
            {/* <!-- Start Col --> */}
            <div className="col-lg-6 col-md-12 pl-0 pt-70 pr-5">
              <div className="business-item-img">
                <img
                  src={"img/business/business-img.png"}
                  className="img-fluid"
                  alt=""
                />
              </div>
            </div>
            {/* <!-- End Col --> */}
            {/* <!-- Start Col --> */}
            <div className="col-lg-6 col-md-12 pl-4">
              <div className="business-item-info">
                <h3>
                  Tailored Solutions for Businesses, Startups, and Agencies
                </h3>
                <p>
                  At Slick, we understand the unique needs of businesses,
                  startups, and agencies. Our expert team delivers customized
                  software solutions that streamline operations, boost
                  efficiency, and drive growth. From innovative startups to
                  established enterprises, we provide the tools and support
                  needed to succeed in a competitive market. Experience the
                  difference with software tailored to your specific needs.
                </p>
              </div>
            </div>
            {/* <!-- End Col --> */}
          </div>
        </div>
      </section>
      {/* <!-- Business Plan Section End --> */}
    </>
  );
}
