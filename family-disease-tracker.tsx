import React, { useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const FamilyDiseaseTracker = () => {
  const [relatives, setRelatives] = useState([]);
  const [currentRelative, setCurrentRelative] = useState({
    name: '',
    disease: '',
    age: '',
    relationship: ''
  });
  const [username, setUsername] = useState('');
  const [userDisease, setUserDisease] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRelative(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (relatives.length < 3) {
      setRelatives(prev => [...prev, currentRelative]);
      setCurrentRelative({ name: '', disease: '', age: '', relationship: '' });
    }
  };

  const getRelationshipDegree = (relationship) => {
    const firstDegree = ['parent', 'sibling', 'child'];
    const secondDegree = ['grandparent', 'aunt', 'uncle', 'niece', 'nephew', 'grandchild'];
    if (firstDegree.includes(relationship.toLowerCase())) return 1;
    if (secondDegree.includes(relationship.toLowerCase())) return 2;
    return 3;
  };

  const graphData = {
    nodes: [
      { id: 'user', name: username, disease: userDisease, color: userDisease ? 'red' : 'blue' },
      ...relatives.map((relative, index) => ({
        id: `relative${index}`,
        name: relative.name,
        disease: relative.disease,
        color: relative.disease === userDisease ? 'red' : 'green'
      }))
    ],
    links: relatives.map((relative, index) => ({
      source: 'user',
      target: `relative${index}`,
      distance: getRelationshipDegree(relative.relationship) * 50
    }))
  };

  const getMessage = () => {
    const firstDegreeWithDisease = relatives.some(r => 
      getRelationshipDegree(r.relationship) === 1 && r.disease === userDisease
    );
    const secondDegreeWithDisease = relatives.some(r => 
      getRelationshipDegree(r.relationship) === 2 && r.disease === userDisease
    );

    if (firstDegreeWithDisease) {
      return "Patient should be investigated for this disease as first degree relatives have the disease.";
    } else if (secondDegreeWithDisease) {
      return "Patients might want to be investigated for this disease as second degree relatives have it.";
    } else {
      return "No need to investigate patient, first and second degree relatives do not have the disease.";
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Family Disease Tracker</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="User name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Disease"
          value={userDisease}
          onChange={(e) => setUserDisease(e.target.value)}
          className="border p-2"
        />
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Relative name"
          value={currentRelative.name}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="disease"
          placeholder="Relative disease"
          value={currentRelative.disease}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          name="age"
          placeholder="Relative age"
          value={currentRelative.age}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="relationship"
          placeholder="Relative relationship"
          value={currentRelative.relationship}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={relatives.length >= 3}>
          Add Relative
        </button>
      </form>

      {relatives.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Relatives:</h2>
          <ul>
            {relatives.map((relative, index) => (
              <li key={index}>
                {relative.name} - {relative.relationship} - {relative.age} years old - {relative.disease}
              </li>
            ))}
          </ul>
        </div>
      )}

      {relatives.length > 0 && (
        <div className="mb-4" style={{ width: '100%', height: '400px' }}>
          <ForceGraph2D
            graphData={graphData}
            nodeLabel="name"
            nodeColor="color"
            nodeRelSize={8}
          />
        </div>
      )}

      {relatives.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Disease Investigation</AlertTitle>
          <AlertDescription>{getMessage()}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FamilyDiseaseTracker;
