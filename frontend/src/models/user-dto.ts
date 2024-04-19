class UserRegistrationDto {
    fullName: string;
    phoneNumber: string;
    password: string;
    email: string;

    constructor(fullName: string, email: string, phoneNumber: string, password: string) {
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.email = email;
    }
}


class UserDto {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;

    constructor(id: string, fullName: string, phoneNumber: string, email: string) {
        this.id = id;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }
}

class UserPhoneLoginDto {
    phoneNumber: string;
    password: string;

    constructor(phoneNumber: string, password: string) {
        this.password = password;
        this.phoneNumber = phoneNumber;
    }

}

class UserEmailLoginDto {
    email: string;
    password: string;

    constructor(email: string, password: string) {
        this.password = password;
        this.email = email;
    }

}

export {UserDto, UserRegistrationDto, UserPhoneLoginDto, UserEmailLoginDto}
