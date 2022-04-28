import { useState, useEffect } from 'react';
import http from '../http-common';

const createCamera = (props) => {
    const { allValues } = props;

        return  http.post(`/cameras`,{
            allValues: allValues,
        })
    };
export default createCamera