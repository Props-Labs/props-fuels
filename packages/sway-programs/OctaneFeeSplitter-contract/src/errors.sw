library;

pub enum SetError {
    ValueAlreadySet: (),
}

pub enum DistributionError {
    CanNotSendZero: (),
}
