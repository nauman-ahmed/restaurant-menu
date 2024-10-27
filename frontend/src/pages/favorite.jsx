import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux'; 
import { Table } from 'reactstrap';
import Navbar from "../components/global/navbar";
import { useNavigate } from "react-router-dom";
import { getRatingsInArray, getCleanText } from '../utilities';

const FavoriteTab = ({ ratings }) => {
  
    const credentials = useSelector((state) => state.credentials.credentials);
    const navigate = useNavigate()
    const foodData = useRef(getRatingsInArray(ratings))

    useEffect(() => {

        if (credentials?.role !== 'Student') {
            navigate('/')
        } 
        
    }, []);    


    return (
        <div>
            <h2 className="text-center my-4">Food Ratings</h2>
                    <Table bordered hover responsive>
                        <thead>
                        <tr>
                            <th>S.no</th>
                            <th>Food Name</th>
                            <th>Ratings</th>
                        </tr>
                        </thead>
                        <tbody>
                        {foodData.current?.map((item, index) => (
                            <tr key={index}>
                            <td>{item.sNo}</td>
                            <td>{getCleanText(item.foodName)}</td>
                            <td>{item.rating}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
            
        </div>
  );
};

export default FavoriteTab;
