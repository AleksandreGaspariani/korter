import { Link } from "react-router-dom"
import { Building2, Home, MapPin, Key, Users, TrendingUp } from "lucide-react"

const PromotionalSection = ({ totalCottage, totalComplex, totalCommercial }) => {

  console.log('PromotionalSection props:', { totalCottage, totalComplex, totalCommercial });

  const carouselItems = [
    { title: "საცხოვრებელი კომპლექსები", count: `${totalComplex} მშენებარე`, icon: Building2, color: "bg-blue-100 text-blue-600" },
    // { title: "იყიდება ბინები", count: "16,437 ბინა", icon: Home, color: "bg-indigo-100 text-indigo-600" },
    { title: "კოტეჯები", count: `${totalCottage} კოტეჯი`, icon: Home, color: "bg-cyan-100 text-cyan-600" },
    { title: "კომერციული ფართები", count: `${totalCommercial} კომერციული ფართი`, icon: Building2, color: "bg-sky-100 text-sky-600" },
    // { title: "ქირავდება ბინები", count: "27,445 ბინა", icon: Key, color: "bg-blue-100 text-blue-600" },
    // { title: "ქირავდება სახლები", count: "774 სახლი", icon: Users, color: "bg-indigo-100 text-indigo-600" },
  ]

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 md:px-12">
      {/* Top section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Left Card - Main Promotional */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              ახალი შეთავაზებები
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
              ახალი აშენებული კომპლექსები და ბინები თბილისში
            </h2>
            <p className="text-blue-100 mb-6 text-sm md:text-base">
              აღმოაჩინეთ საუკეთესო უძრავი ქონება ჩვენს ინტერაქტიულ რუკაზე
            </p>
            <Link to="/map">
              <button className="bg-white text-blue-700 font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                რუკაზე ნახვა
              </button>
            </Link>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 right-8 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-t from-indigo-500/30 to-transparent rounded-full"></div>
        </div>

        {/* Right Card - Property Listing */}
        <div className="bg-white rounded-2xl p-8 flex flex-col justify-between shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div>
            <div className="inline-flex items-center bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium mb-4">
              <Building2 className="w-4 h-4 mr-2" />
              გამყიდველებისთვის
            </div>
            <h2 className="text-xl md:text-2xl text-gray-900 font-bold mb-3">
              გსურთ ბინის, სახლის ან ნაკვეთის გაყიდვა?
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              განათავსეთ უფასოდ ქონება Homeinfo-ზე და სარგებლეთ მომგებიანი მახასიათებლებით
            </p>
          </div>
          <div>
            <Link to={'/add-property'} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              + ქონების დამატება
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="relative">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">კატეგორიები</h3>
        {/* Enhanced gradient masks */}
        <div className="pointer-events-none absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-blue-50 via-blue-50/80 to-transparent z-0" />
        <div className="pointer-events-none absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-blue-50 via-blue-50/80 to-transparent z-0" />
        <div className="overflow-x-auto scrollbar-hide relative z-10">
          <div className="flex space-x-4 px-2 pb-2">
            {carouselItems.map((item, index) => {
              const IconComponent = item.icon;
              // Map card title to route
              let route = "#";
              if (item.title === "საცხოვრებელი კომპლექსები") route = "/new-buildings";
              if (item.title === "იყიდება ბინები") route = "/search/apartments?category=flats&type=sale";
              if (item.title === "კოტეჯები") route = "/search/apartments?category=cottages&type=sale";
              if (item.title === "სახლების გაყიდვა") route = "/search/apartments?category=houses&type=sale";
              if (item.title === "ქირავდება ბინები") route = "/search/apartments?category=flats&type=rent";
              if (item.title === "ქირავდება სახლები") route = "/search/apartments?category=houses&type=rent";
              return (
                <Link to={route} key={index}>
                  <div
                    className="min-w-[200px] bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer group"
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${item.color} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium">{item.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromotionalSection
