import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button } from 'reactstrap';
import Navbar from "../components/global/navbar";
import { useNavigate } from "react-router-dom";
import { getRatingsInArray, getCleanText } from '../utilities';
import { FaSortAmountDown, FaSortAmountUp, FaClock } from 'react-icons/fa';  // Importing icons

const FavoriteTab = ({ ratings }) => {
    const credentials = useSelector((state) => state.credentials.credentials);
    const navigate = useNavigate();
    const [foodData, setFoodData] = useState(getRatingsInArray(ratings));
    const [foodDataShow, setFoodDataShow] = useState(getRatingsInArray(ratings));
    const [sortType, setSortType] = useState(null);

    useEffect(() => {
        if (credentials?.role !== 'Student') {
            navigate('/');
        }
    }, [credentials, navigate]);

    // Sorting functions
    const sortByMostRecentFavorited = (data) => {
        return [data[data.length-1]];
    };

    const sortByRatingDesc = (data) => {
        return data.slice().sort((a, b) => b.rating - a.rating);
    };

    const sortByRatingAsc = (data) => {
        return data.slice().sort((a, b) => a.rating - b.rating);
    };

    // General sort function that applies the appropriate sorting method
    const sortData = (data, sortBy) => {
        switch (sortBy) {
            case 'mostRecent':
                return sortByMostRecentFavorited(foodData);
            case 'ratingDesc':
                return sortByRatingDesc(data);
            case 'ratingAsc':
                return sortByRatingAsc(data);
            default:
                return data;
        }
    };

    // Handle sorting action
    const handleSort = (sortBy) => {
        setSortType(sortBy);
        setFoodDataShow(sortData(foodData, sortBy));
    };

    return (
        <div>
            <Navbar />
            <h2 className="text-center my-4">Food Ratings</h2>
            
            {/* Sorting Buttons */}
            <div className="d-flex justify-content-center mb-3">
                <Button color="primary" className="mx-2" onClick={() => handleSort('mostRecent')}>
                    <FaClock /> Most Recent
                </Button>
                <Button color="primary" className="mx-2" onClick={() => handleSort('ratingDesc')}>
                    <FaSortAmountDown /> Rating (High to Low)
                </Button>
                <Button color="primary" className="mx-2" onClick={() => handleSort('ratingAsc')}>
                    <FaSortAmountUp /> Rating (Low to High)
                </Button>
            </div>

            {/* Ratings Table */}
            <Table bordered hover responsive>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Food Name</th>
                        <th>Ratings</th>
                    </tr>
                </thead>
                <tbody>
                    {foodDataShow.map((item, index) => (
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
