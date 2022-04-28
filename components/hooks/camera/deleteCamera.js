import { useState, useEffect } from 'react';
import http from '../http-common';

const deleteCamera = (props) => {
    const { id } = props;

        return  http.delete(`/cameras/${id}`)
    };
export default deleteCamera