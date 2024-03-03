import { Button, TextInput } from "rb-base-element"
import { useState } from "react"

const AddDisbursement = (props: {
    onSave: (month: number, amount: number)=>void,
    namePrfix: string,
    amount: number, 
    month: number
}) => {

    const [disburse, setDisburse] = useState({amount:0, month: 0})

    return (<div id={`DisbursementAddOuterDiv${props.namePrfix}`} style={{display:'flex', flex:1, flexDirection:'row'}}>
        <div style={{display:'flex', flex:2}}>
        <TextInput name={`MonthDisburseTextInput${props.namePrfix}`}
                textType="numeric"
                placeHolderText="Month"
                value={''+props.month}
                onChangeHandler={(text:string)=>{
                    setDisburse((currentState)=>{
                        const newState = {...currentState}
                        if (text === ''){
                            newState.month = 0
                        }else{
                            newState.month = parseInt(text)
                        }
                        return newState
                    })
                }}  />
        </div>
        <div style={{display:'flex', flex:2}}>
            <TextInput name={`AmountDisburseTextInput${props.namePrfix}`}
                textType="numeric"
                placeHolderText="Amount"
                value={''+props.amount}
                onChangeHandler={(text:string)=>{
                    setDisburse((currentState)=>{
                        const newState = {...currentState}
                        if (text === ''){
                            newState.amount = 0
                        }else{
                            newState.amount = parseInt(text)
                        }
                        return newState
                    })
                }}  />
        </div>
        
        <div style={{display:'flex', flex:1}}>
            <Button name="Save" importance="primary" size="medium" key={`MonthDisburseSave${props.namePrfix}`}
                onClick={()=>{
                    props.onSave(disburse.month, disburse.amount)
                }}/>
        </div>
    </div>)
}

export {AddDisbursement}