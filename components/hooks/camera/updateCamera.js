import { useState, useEffect } from 'react';
import http from '../http-common';

const updateCamera = (props) => {
    const { allValues, id } = props;

        return  http.put(`/cameras/${id}`,{
            allValues: allValues,
        })
    };
export default updateCamera