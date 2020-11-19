import React from 'react';
import './Infobox.css';
import {Card, CardContent, Typography } from "@material-ui/core"
import numeral from 'numeral'

function Infobox({title, cases, total, isRed, isBlack, active, ...props}) {
    return (
            <Card
                onClick={props.onClick}
                className={`infoBox ${active && "infoBox--selected"} 
                ${isRed && "infoBox--red"}
                ${isBlack && "infoBox--black"}`}
            >
            <CardContent>
                {/* Title */}
                <Typography className = "infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                
                <h2 className = "infoBox__total">{numeral(total).format("0,0")}</h2>
                
                <Typography className = "infoBox__cases" color= "textSecondary">
                    Today: {numeral(cases).format("0,0")}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Infobox



