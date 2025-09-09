import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://dogapi.dog/api/v2/breeds';

export default function BreedList() {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setBreeds(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch breeds');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Dog Breeds Explorer</h1>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {breeds.map(breed => (
      <div
        key={breed.id}
        className="bg-gradient-to-br from-blue-100 via-white to-pink-100 text-black cursor-pointer border border-blue-200 rounded-xl shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl hover:border-pink-400 hover:bg-gradient-to-br hover:from-pink-100 hover:via-white hover:to-blue-100"
      >
        <h2 className="text-xl text-blue-700 font-bold mb-2">{breed.attributes.name}</h2>
        <p className="mb-2 text-gray-700">{breed.attributes.description}</p>
        <div className="text-sm text-gray-600">
          <div>Life Span: <span className="text-pink-600">{breed.attributes.life.min} - {breed.attributes.life.max}</span> years</div>
          <div>Male Weight: <span className="text-blue-600">{breed.attributes.male_weight.min} - {breed.attributes.male_weight.max}</span> kg</div>
          <div>Female Weight: <span className="text-pink-600">{breed.attributes.female_weight.min} - {breed.attributes.female_weight.max}</span> kg</div>
          <div>Hypoallergenic: <span className={breed.attributes.hypoallergenic ? 'text-green-600' : 'text-red-600'}>{breed.attributes.hypoallergenic ? 'Yes' : 'No'}</span></div>
        </div>
      </div>
    ))}
      </div>
    </div>
  );
}
