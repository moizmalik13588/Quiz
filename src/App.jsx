import React, { useState, useEffect } from 'react';
import axios from 'axios';

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}


const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    fetchQuizQuestions();
  }, []);

  const fetchQuizQuestions = async () => {
    try {
      const response = await axios.get('https://the-trivia-api.com/v2/questions');
      console.log(response.data);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questions.length) {
      const options = shuffleArray([
        ...questions[currentIndex].incorrectAnswers,
        questions[currentIndex].correctAnswer,
      ]);
      setShuffledOptions(options);
      setSelectedOption(null);
    }
  }, [currentIndex, questions]);

  const handleNextQuestion = () => {
    if (selectedOption) {
      if (selectedOption === questions[currentIndex].correctAnswer) {
        setScore((prevScore) => prevScore + 1);
      }

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setQuizEnded(true);
      }
    } else {
      alert('Please select any option!!!');
    }
  };

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  if (loading) {
    return <div className="text-4xl w-full min-h-screen bg-gray-900 font-bold text-white flex items-center justify-center">Loading...</div>;
  }
  const handleRestartQuiz = () => {
    setScore(0);
    setCurrentIndex(0);
    setQuizEnded(false);
    setSelectedOption(null);
    setShuffledOptions([]);
  };


  if (quizEnded) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <h2 className="text-4xl font-bold mb-4 text-white">Quiz Ended!!!</h2>
        <p className="text-xl text-gray-300">Your Score: {score} / {questions.length}</p>
        <button
          onClick={handleRestartQuiz}
          className="mt-5 px-6 py-3 bg-green-600 text-white rounded-lg"
        >
          Restart Quiz
        </button>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 p-6">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg p-8 w-full max-w-4xl flex">
        <div className="w-1/2 pr-8 flex flex-col justify-center items-center border-r border-gray-600">
      <h1 className='font-bold text-4xl mb-8'>Quiz App</h1>

          <h2 className="text-2xl font-semibold mb-6">
            Q{currentIndex + 1}: {questions[currentIndex]?.question?.text}
          </h2>
        </div>

        <div className="w-1/2 pl-8">
          <div className="space-y-4">
            {shuffledOptions.map((item, index) => (
              <label
                key={index}
                className={`block p-4 rounded-lg cursor-pointer transition-all ${selectedOption === item ? 'bg-green-600 text-white' : 'bg-gray-700'
                  }`}
              >
                <input
                  type="radio"
                  name="quiz"
                  value={item}
                  className="mr-2"
                  onChange={() => handleOptionChange(item)}
                  checked={selectedOption === item}
                />
                {item}
              </label>
            ))}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={handleNextQuestion}
              className="bg-green-600 text-white px-6 py-3 rounded-lg w-full hover:bg-green-800 transition"
            >
              {currentIndex + 1 < questions.length ? 'Next' : 'Finish Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
