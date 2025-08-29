export type Contact = {
    id: string,
    name: string,
    email: string,
    phone: number | null,
    isPrimary: boolean
}

export type Volunteer = {
    id: string,
    name: string,
    dateStart: string,
    dateEnd: string
}

export type HomeAddress = {
    id: string,
    address1: string,
    address2: string,
    city: string,
    state: string,
    zip: string,
}
