import { CommandFunction } from "../typings/Command"

export class SubCommand {
    constructor(public name: string, public execute: CommandFunction) {}
}
