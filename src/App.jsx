import { useState } from 'react';
import { Calculator, Timer, Zap } from 'lucide-react';

export default function TrackPacingCalculator() {
  const [inputType, setInputType] = useState('pace'); // 'pace' or 'speed'
  const [paceMinutes, setPaceMinutes] = useState('5');
  const [paceSeconds, setPaceSeconds] = useState('00');
  const [speedKmh, setSpeedKmh] = useState('12');

  // Convert pace (min/km) to speed (km/h)
  const paceToSpeed = (minutes, seconds) => {
    const totalMinutes = parseFloat(minutes) + parseFloat(seconds) / 60;
    if (totalMinutes <= 0) return 0;
    return (60 / totalMinutes).toFixed(2);
  };

  // Convert speed (km/h) to pace (min/km)
  const speedToPace = (kmh) => {
    const speed = parseFloat(kmh);
    if (speed <= 0) return { minutes: 0, seconds: 0 };
    const totalMinutes = 60 / speed;
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);
    return { minutes, seconds };
  };

  // Calculate split times for common track distances
  const calculateSplits = () => {
    let speedInKmh;
    
    if (inputType === 'pace') {
      speedInKmh = parseFloat(paceToSpeed(paceMinutes, paceSeconds));
    } else {
      speedInKmh = parseFloat(speedKmh);
    }

    if (speedInKmh <= 0) return [];

    const distances = [
      { name: '100m', distance: 0.1 },
      { name: '200m', distance: 0.2 },
      { name: '400m', distance: 0.4 },
      { name: '800m', distance: 0.8 },
      { name: '1000m', distance: 1.0 },
      { name: '1500m', distance: 1.5 },
      { name: '3000m', distance: 3.0 },
      { name: '5000m', distance: 5.0 },
      { name: '10000m', distance: 10.0 }
    ];

    return distances.map(d => {
      const timeInHours = d.distance / speedInKmh;
      const timeInSeconds = timeInHours * 3600;
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.round(timeInSeconds % 60);
      return {
        ...d,
        time: `${minutes}:${seconds.toString().padStart(2, '0')}`
      };
    });
  };

  const splits = calculateSplits();
  const currentSpeed = inputType === 'pace' 
    ? paceToSpeed(paceMinutes, paceSeconds)
    : speedKmh;
  const currentPace = inputType === 'speed'
    ? speedToPace(speedKmh)
    : { minutes: parseInt(paceMinutes), seconds: parseInt(paceSeconds) };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Track Pacing Calculator</h1>
          </div>

          {/* Input Type Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setInputType('pace')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                inputType === 'pace'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Timer className="w-5 h-5 inline mr-2" />
              Enter Pace (min/km)
            </button>
            <button
              onClick={() => setInputType('speed')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                inputType === 'speed'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Zap className="w-5 h-5 inline mr-2" />
              Enter Speed (km/h)
            </button>
          </div>

          {/* Input Fields */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            {inputType === 'pace' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pace (min/km)
                </label>
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      value={paceMinutes}
                      onChange={(e) => setPaceMinutes(e.target.value)}
                      className="w-full px-4 py-3 text-2xl border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                      placeholder="5"
                    />
                    <span className="text-sm text-gray-600 mt-1 block">minutes</span>
                  </div>
                  <span className="text-3xl font-bold text-gray-400">:</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={paceSeconds}
                      onChange={(e) => setPaceSeconds(e.target.value)}
                      className="w-full px-4 py-3 text-2xl border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                      placeholder="00"
                    />
                    <span className="text-sm text-gray-600 mt-1 block">seconds</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speed (km/h)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={speedKmh}
                  onChange={(e) => setSpeedKmh(e.target.value)}
                  className="w-full px-4 py-3 text-2xl border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  placeholder="12"
                />
              </div>
            )}
          </div>

          {/* Conversion Display */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-indigo-50 rounded-xl p-4">
              <div className="text-sm font-medium text-indigo-600 mb-1">Speed</div>
              <div className="text-3xl font-bold text-indigo-900">
                {currentSpeed} <span className="text-lg">km/h</span>
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-sm font-medium text-purple-600 mb-1">Pace</div>
              <div className="text-3xl font-bold text-purple-900">
                {currentPace.minutes}:{currentPace.seconds.toString().padStart(2, '0')} 
                <span className="text-lg"> min/km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Split Times */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Split Times</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {splits.map((split) => (
              <div
                key={split.name}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="text-sm font-semibold text-gray-600 mb-1">
                  {split.name}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {split.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}