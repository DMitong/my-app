
// Import useState and useEffect 
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import "./App.css";
import ContractAbi from './ColourBoard.json';

const CONTRACT_ADDRESS = '0x74E861FD80C748eA8A7EEf48c301B50b75397266'
const CONTRACT_ABI = ContractAbi.abi

const initializeContract = () => {
  const provider = new ethers.getDefaultProvider("sepolia");
  const signer = provider.getSigner()
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

  return contract
}

const contract = initializeContract()

// Contract interaction logic
const initializeColors = async () => {
  await contract.initializeColours();
}

const getColor = async (row, col) => {
  return await contract.getColour(row, col);
}

// Component code
function App() {

  const [board, setBoard] = useState([]); 

  useEffect(() => {
    initializeColors();

    const generateBoard = async () => {
      const board = [];

      try {
        for(let i = 0; i < 5; i++) {
          const row = [];
          for(let j = 0; j < 7; j++) {
             const color = await getColor(i, j);
             row.push(color);
          }
          board.push(row);  
        }
      } catch (error) {
        console.error(error);
      }

      setBoard(board);
    }

    generateBoard();

  }, [board]);

const renderBoard = () => {
  return board.map((row, i) => {
    return (
      <div key={i} className="row">
        {row.map((color, j) => (
          <div 
            key={`${i}-${j}`}
            className="cell"
            style={{backgroundColor: getColorCode(color)}} 
          />
        ))}
      </div>
    )
  })
}

const getColorCode = (color) => {
  switch(color) {
    case 0: return 'white';
    case 1: return 'black';
    case 2: return 'red';
    case 3: return 'green';
    default: throw new Error(`Invalid color index: ${color}`);
  }
}
return (
  <div className="app">

    <h1>Color Board</h1>

    <button onClick={initializeColors}>Initialize</button>

    <div className="board">
      {renderBoard()}
    </div>

  </div>
)
}

export default App;

