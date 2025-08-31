import { Coffee, Leaf, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white/90">
      {/* Hero Section */}
      <section className="relative h-screen bg-[url(/img/black-coffee.webp)] bg-cover bg-center bg-fixed">
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Crafting Exceptional Coffee Since 2019
            </h1>
            <p className="text-xl text-gray-200 md:text-2xl max-w-3xl mx-auto">
              We're obsessed with bringing you the world's finest single-origin
              and small-batch roasted coffee, ethically sourced and artisanally
              crafted.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Brewing Excellence, Cultivating Community
          </h2>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 h-[500px] rounded-xl overflow-hidden shadow-xl">
              <img
                src="/img/coffee4.webp"
                alt="Coffee beans being roasted"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:w-1/2 bg-white p-8 rounded-xl shadow-lg">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                At Roaster Bros, we believe coffee is more than just a beverage
                — it's a connection to the earth, the farmers, and the
                community. Born from a passion for both the art of coffee and
                the science of perfect roasting, our mission is to create
                exceptional experiences in every cup.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                From our direct relationships with coffee growers to our
                meticulous small-batch roasting process, we're redefining
                specialty coffee culture — one carefully crafted batch at a
                time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white/90">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16 bg-white ">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              To elevate the coffee experience through ethical sourcing, artisan
              roasting, and community-focused café culture.
            </p>
          </div>
          <div className="mb-16 bg-white ">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Our Vision
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              To build a specialty coffee brand that connects Kenyan coffee
              lovers with the world's finest beans while supporting sustainable
              farming practices.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coffee className="text-amber-700" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Quality
              </h3>
              <p className="text-gray-700">
                From bean selection to final roast, we pursue perfection in
                every step of our process.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="text-amber-700" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Sustainability
              </h3>
              <p className="text-gray-700">
                We partner with farms using regenerative agriculture and
                maintain carbon-neutral roasting.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-amber-700" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Community
              </h3>
              <p className="text-gray-700">
                We invest in coffee-growing communities and create spaces for
                coffee lovers to connect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 ">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
            Our Journey
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-amber-200"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-5 md:text-right">
                  <h3 className="text-xl font-bold text-amber-700 mb-2">
                    2019
                  </h3>
                  <p className="text-gray-700">
                    Founded with a vision to bring specialty coffee to Nairobi
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2  w-4 h-4 rounded-full bg-amber-600 border-4 border-amber-100 mt-1 md:mt-0"></div>
                <div className="md:w-1/2 md:pl-12"></div>
              </div>

              <div className="relative flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2  w-4 h-4 rounded-full bg-amber-600 border-4 border-amber-100 mt-1 md:mt-0"></div>
                <div className="md:w-1/2 md:pl-5">
                  <h3 className="text-xl font-bold text-amber-700 mb-2">
                    2021
                  </h3>
                  <p className="text-gray-700">
                    Opened our first flagship coffee bar in Westlands
                  </p>
                </div>
              </div>

              <div className="relative flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-5 md:text-right">
                  <h3 className="text-xl font-bold text-amber-700 mb-2">
                    2024
                  </h3>
                  <p className="text-gray-700">
                    Launched our online store with nationwide delivery
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2  w-4 h-4 rounded-full bg-amber-600 border-4 border-amber-100 mt-1 md:mt-0"></div>
                <div className="md:w-1/2 md:pl-12"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white/90 text-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Our Coffee?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover our carefully curated selection of single-origin and
            specialty blend coffees, roasted to perfection.
          </p>
          <Button
            onClick={() => navigate("/shop")}
            className="bg-amber-700 text-white hover:bg-amber-800 px-8 py-6 text-lg font-medium"
          >
            Shop Our Coffee
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
