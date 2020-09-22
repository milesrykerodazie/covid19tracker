import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import "./componentsCss/InfoBox.css"
import {prettyPrintStat} from "../utils"

const InfoBox = ({title, cases, isRed, isYellow, isGreen, active, total, ...props}) => {
    return (
            <Card onClick={props.onClick} className={`infoBox ${active && "InfoBox--selected"} ${isRed && "infoBox--red"} ${isYellow && "infoBox--yellow"}`}>
                <CardContent>
                    <h2 className="infoBox_title" color="textSecondary">{title}</h2>

                    <h3 className={`infoBox_cases ${isRed && "infoBox__red"} ${isYellow && "infoBox__yellow"} ${isGreen && "infoBox__green"}`}>
                        {prettyPrintStat(cases)}
                     </h3>

                    <Typography className="infoBox_total" color="textSecondary"> Total Of : {prettyPrintStat(total)}</Typography>
                </CardContent>
            </Card>
    )
}

export default InfoBox

