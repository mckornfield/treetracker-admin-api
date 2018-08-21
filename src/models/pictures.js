import Axios from "axios";
import { API_ROOT } from '../common/variables.js'
import React from 'react'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'


const pictures = {
    state: {
        data: [],
        hasMoreItems: true,
        page: 0
    },
    reducers: {
        getPictures(state, payload, { page }) {
            return {
                data: state.data.concat(payload),
                hasMoreItems: true,
                page: page
            }
        }
    },
    effects: {
        getPicturesAsync(count) {
            const query = `${API_ROOT}/trees?filter[limit]=${count.count}&filter[skip]=0&filter[fields][id]=true&filter[fields][imageUrl]=true`;
            console.log(query);
            Axios.get(query)
                .then((response) => {
                    console.log(response);
                    this.getPictures(response.data, 0)
                })
        }
    }
}

export default pictures
