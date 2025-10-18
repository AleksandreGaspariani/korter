import { useState } from "react"
import { FiInfo, FiEye } from "react-icons/fi"

const FloorPlans = ({ property }) => {
  const [selectedPlan, setSelectedPlan] = useState(null)

  // Use actual data from property if available, fallback to demo data
  const floorPlans =
    property?.floorPlans && Array.isArray(property.floorPlans) &&
    property.floorPlans.length > 0 ? property.floorPlans : 'No floor plan yet';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">გეგმარებები და ფასები {property.title}-ში</h2>

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center text-gray-600">
            <FiInfo className="mr-2 text-blue-600" size={16} />
            <span className="text-sm">
              ფასები და ხელმისაწვდომი ბინები აქტუალურია <span className="font-semibold">10 აგვისტო 2025</span>{" "}
              მდგომარეობით
            </span>
          </div>
        </div>

        {/* <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
          <FiEye className="mr-1" size={14} />
          შეგვატყობინეთ უზუსტობის შესახებ
        </button> */}
      </div>

      {/* Floor Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {Array.isArray(floorPlans) && floorPlans.length > 0 ? (
          floorPlans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
                selectedPlan === plan.id
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
            >
              {/* Plan Type */}
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 mb-1">{plan.type}</h3>
                <p className="text-sm text-gray-600">{plan.sizeRange}</p>
              </div>

              {/* Pricing */}
              <div className="mb-4">
                <p className="font-bold text-gray-900 mb-1">{plan.priceFrom}</p>
                <p className="text-sm text-gray-600">{plan.pricePerM2}</p>
              </div>

              {/* Floor Plan Image */}
              <div className="aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden mb-3">
                <img
                  src={plan.image || "/placeholder.svg"}
                  alt={`${plan.type} floor plan`}
                  className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                />
              </div>

              {/* View Details Button */}
              <button
                className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedPlan === plan.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {selectedPlan === plan.id ? "არჩეულია" : "დეტალები"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center col-span-full">გეგმარებები ჯერ არ არის</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <button className="bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-lg font-medium transition-colors flex-1">
          ყველა გეგმარების დათვალიერება
        </button>
      </div>
    </div>
  )
}

export default FloorPlans
