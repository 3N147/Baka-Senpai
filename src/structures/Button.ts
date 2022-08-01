import { ButtonType } from "../typings/Components"

export class Button {
    constructor(commandOptions: ButtonType) {
        Object.assign(this, commandOptions)
    }
}
