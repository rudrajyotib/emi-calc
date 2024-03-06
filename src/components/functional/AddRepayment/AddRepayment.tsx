import { Button, TextInput } from "rb-base-element"
import { useState } from "react"

const AddRepayment = (props: {
    onSave: (month: number, amount: number)=>void,
    namePrfix: string,
    amount: number, 
    month: number
}) => {

    const [payment, setPayment] = useState({amount:0, month: 0})

    return (<div id={`RepaymentAddOuterDiv${props.namePrfix}`} style={{display:'flex', flex:1, flexDirection:'row'}}>
        <div style={{display:'flex', flex:2}}>
        <TextInput name={`MonthRepaymentTextInput${props.namePrfix}`}
                textType="numeric"
                placeHolderText="Month"
                value={''+props.month}
                onChangeHandler={(text:string)=>{
                    setPayment((currentState)=>{
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
            <TextInput name={`AmountRepaymentTextInput${props.namePrfix}`}
                textType="numeric"
                placeHolderText="Amount"
                value={''+props.amount}
                onChangeHandler={(text:string)=>{
                    setPayment((currentState)=>{
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
            <Button name="Save" importance="primary" size="medium" key={`MonthPaymentSave${props.namePrfix}`}
                onClick={()=>{
                    props.onSave(payment.month, payment.amount)
                }}/>
        </div>
    </div>)
}

export {AddRepayment}