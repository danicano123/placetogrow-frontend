import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../../services/Api";
import Swal from "sweetalert2";

const MicrositesList: React.FC = () => {
  const [microsites, setMicrosites] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMicrosites = async () => {
      try {
        const { data, statusCode } = await Api.get("/microsites/active");
        if (statusCode === 200) {
          setMicrosites(data.microsites);
        } else {
          Swal.fire({
            title: "Error",
            text: `${data.message}`,
            icon: "error",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Error: unable to fetch active microsites",
          icon: "error",
        });
      }
    };

    fetchMicrosites();
  }, []);

  const handleNavigate = (slug: string, micrositeId: string) => {
    navigate(`/microsites/${slug}`, { state: { micrositeId } });
  };

  const handleNavigateToform = (slug: string, micrositeId: string) => {
    navigate(`/microsites/${slug}/form/${micrositeId}`, {
      state: { micrositeId },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Microsites</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {microsites?.map((microsite) => (
          <div key={microsite.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-4">
              <img
                src={microsite.logo_url}
                alt={microsite.name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h2 className="text-xl font-bold">{microsite.name}</h2>
                <p className="text-gray-600">{microsite.microsite_type}</p>
              </div>
            </div>
            <div className="py-2 px-4 border-b space-x-4">
              <button
                onClick={() => handleNavigate(microsite.slug, microsite.id)}
                className="bg-gold hover:bg-gold-dark text-white font-bold py-2 px-4 rounded-full mt-4"
              >
                Ver detalles
              </button>
              <button
                onClick={() =>
                  handleNavigateToform(microsite.slug, microsite.id)
                }
                className="bg-gold hover:bg-gold-dark text-white font-bold py-2 px-4 rounded-full mt-4"
              >
                Acceder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MicrositesList;
