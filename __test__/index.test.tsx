import {render, screen} from '@testing-library/react'
import HomePage from "../pages";

describe('HomePage', () => {
    it('renders a New Game button', () => {
        render(<HomePage/>)
        const newGame = screen.getByText("New Game");
        expect(newGame).toBeInTheDocument()
    })
})