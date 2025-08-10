import { Link } from "react-router-dom"
import { ChevronRight, Building2, Home } from "lucide-react"

const DevelopersShowcase = () => {
  const developers = [
    {
      id: 1,
      logo: '../../../images/arqi.jpg',
      nameGeo: "არქი",
      nameEng: "ARQI",
      projects: 17,
      properties: "273,372",
      bgColor: "from-blue-500 to-blue-600",
    },
    {
      id: 2,
      logo: '../../../images/next.svg',
      nameGeo: "Next Group",
      nameEng: "Next Group",
      projects: 1,
      properties: "214,910",
      bgColor: "from-gray-800 to-gray-900",
    },
    {
      id: 3,
      logo: '../../../images/tetri_kvadarti.jpg',
      nameGeo: "თბილისი კაპიტალი",
      nameEng: "Tbilisi Capital",
      projects: 7,
      properties: "211,389",
      bgColor: "from-teal-500 to-teal-600",
    },
    {
      id: 4,
      logo: '../../../images/aparat.jpg',
      nameGeo: "Apart Development",
      nameEng: "Apart Development",
      projects: 4,
      properties: "207,663",
      bgColor: "from-slate-700 to-slate-800",
    },
    {
      id: 5,
      logo: '../../../images/company.webp',
      nameGeo: "m²",
      nameEng: "m²",
      projects: 6,
      properties: "207,663",
      bgColor: "from-blue-500 to-blue-600",
    },
  ]

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 md:px-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">სამშენებლო კომპანიები თბილისი</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
        </div>

        <Link
          to="/developers"
          className="flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 group"
        >
          <span className="mr-2">ყველა დეველოპერი</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>

      {/* Developers Grid */}
      <div className="relative">
        {/* Gradient masks for smooth edges */}
        <div className="pointer-events-none absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-blue-50 via-blue-50/80 to-transparent z-0"></div>
        <div className="pointer-events-none absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-blue-50 via-blue-50/80 to-transparent z-0"></div>
        <div className="overflow-x-auto scrollbar-hide relative z-10">
          <div className="flex space-x-6 px-2 pb-4">
            {developers.map((developer, index) => (
              <div
                key={developer.id}
                className="min-w-[280px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 overflow-hidden group cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Logo Section */}
                <div
                  className={`bg-gradient-to-br ${developer.bgColor} p-8 flex items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/5"></div>
                  <img
                    src={developer.logo || "/placeholder.svg"}
                    alt={developer.nameEng}
                    className="w-full h-20 object-contain filter brightness-0 invert relative z-10 group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Decorative elements */}
                  <div className="absolute top-2 right-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                  <div className="absolute bottom-2 left-2 w-12 h-12 bg-white/5 rounded-full blur-lg"></div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                      {developer.nameGeo}
                    </h3>
                    {developer.nameEng !== developer.nameGeo && (
                      <p className="text-sm text-gray-500 font-medium">{developer.nameEng}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Building2 className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="text-sm font-medium">გაყიდვაშია</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{developer.projects} პროექტი</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Home className="w-4 h-4 mr-2 text-indigo-500" />
                        <span className="text-sm font-medium">ბინები</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">{developer.properties} ლ-დან</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">პოპულარობა</span>
                      <span className="text-xs font-semibold text-blue-600">
                        {Math.floor(Math.random() * 30 + 70)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${developer.bgColor} h-2 rounded-full transition-all duration-1000 group-hover:w-full`}
                        style={{ width: `${Math.floor(Math.random() * 30 + 70)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
          <div className="text-2xl font-bold text-blue-600">150+</div>
          <div className="text-sm text-gray-600">აქტიური დეველოპერი</div>
        </div>
        <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
          <div className="text-2xl font-bold text-indigo-600">2,500+</div>
          <div className="text-sm text-gray-600">პროექტი</div>
        </div>
        <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
          <div className="text-2xl font-bold text-cyan-600">45,000+</div>
          <div className="text-sm text-gray-600">ბინა</div>
        </div>
        <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
          <div className="text-2xl font-bold text-blue-700">98%</div>
          <div className="text-sm text-gray-600">კმაყოფილება</div>
        </div>
      </div>
    </div>
  )
}

export default DevelopersShowcase
