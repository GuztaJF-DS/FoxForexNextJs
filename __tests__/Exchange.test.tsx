import {render,screen,fireEvent} from '@testing-library/react';
import Exchange from '../pages/components/Exchange';
import WebsocketConnect from '../pages/api/WebsocketConnection';
import '@testing-library/jest-dom'

describe("Testing Exchange",()=>{
    const websocket=WebsocketConnect();

    it('it renders the Bid Text',()=>{
        render(<Exchange socket={websocket}/>);
        const loadBid=screen.getByText(/Bid:/)
        expect(loadBid).not.toBe(null)
    })

    it('Change the LotsInput Value',()=>{
        render(<Exchange socket={websocket}/>);
        const LotsInput=screen.getByTestId("lotsInput");
        const SellButton=screen.getByTestId("SellButton");
        const ButButton=screen.getByTestId("BuyButton");
        
        fireEvent.change(LotsInput,{target:{value:"5"}})

        expect(LotsInput).toHaveValue(5)
    })
})