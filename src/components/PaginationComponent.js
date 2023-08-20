import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "./style.css";

 const renderData = (data) => {
  let currYear = new Date().getFullYear();
   return (
       data.map((todo, index) => {
         return( <tr key = {index}>
        <td><img src = { todo.squareImage } alt ="billionare pics" loading="lazy"/> </td>  
        <td>{todo.personName}</td>
        <td>{todo.rank}</td>
        <td>{(todo.finalWorth/1000 ).toFixed(3) + "  Billion  USD "}</td>
        <td>{ todo.countryOfCitizenship}</td>
        <td>{ currYear - new Date(todo.birthDate).getFullYear() }</td>
          </tr>
          )
       })
      
     
   );
 };

function PaginationComponent() {
  //setting the state
  const [data, setData] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [isLoaded ,setIsLoaded] =useState(false)
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
  
  //setting const
  const itemsPerPage = 5;
  const pageNumberLimit = 5;
  const handleClick = (event) => {
    setcurrentPage(Number(event.target.id));
  };

  const pages = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pages.push(i);
}

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);



  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
     
      return (
        <li
         
          key={number}
          id={number}
          onClick={handleClick}
          className={currentPage === number ? "active" : null}
        >
          {number}
         
        </li>
      );
    } else {
      return null;
    }
  });

  useEffect(() => {
   fetch("https://forbes400.onrender.com/api/forbes400/")
      .then((response) => response.json())
      .then((json) => setData(json))
      .then(() => setIsLoaded(true) )
      
  }, []);

 const handleNextbtn = () => {
    setcurrentPage(currentPage + 1);

     if (currentPage + 1 > maxPageNumberLimit) {

       setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
       setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
     }
  };

  const handlePrevbtn = () => {
    setcurrentPage( currentPage - 1 );

    if ((currentPage - 1) % pageNumberLimit === 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

// console.log(data)

  return (
    <>
      {isLoaded ? <div className="html-wrap">
      <h1>Top 400 Rich People</h1> <br />
      <div  style = { {"overflow-x":"auto"} }  >
      <table cellPadding="20px" cellSpacing= '0' width="100%" rules="none">
      <tbody>
      <tr >
      <th>Image</th>
      <th>Name</th>
      <th>Rank</th>
      <th>Net Worh</th>
      <th>Country</th>
      <th>Age</th>
      </tr>
      {renderData(currentItems)}
      </tbody>
      </table>
      </div>
      <ul className="pageNumbers">
        <li>
          <button
            onClick={handlePrevbtn}
            disabled={currentPage === pages[0] ? true : false}
          >
            Prev
          </button>
        </li>
        
        {renderPageNumbers}
        

        <li>
          <button
            onClick={handleNextbtn}
            disabled={currentPage === pages[pages.length - 1] ? true : false}
          >
            Next
          </button>
        </li>
      </ul>
     
      </div>
    : "Loading..." }
    </>
  );
}

export default PaginationComponent;
