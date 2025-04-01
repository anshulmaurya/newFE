# I2C (Inter-Integrated Circuit)

## Introduction

I2C (Inter-Integrated Circuit, pronounced "I-squared-C") is a synchronous, multi-master, multi-slave, packet-switched, single-ended, serial communication bus invented by Philips Semiconductor (now NXP Semiconductors). It is widely used for attaching lower-speed peripheral ICs to processors and microcontrollers in short-distance, intra-board communication.

## Basic Principles

I2C uses only two bidirectional open-drain lines:
- **SDA (Serial Data Line)**: Carries the data
- **SCL (Serial Clock Line)**: Carries the clock signal

Both lines are pulled up with resistors, typically between 4.7kΩ and 10kΩ, allowing multiple devices to connect to the same bus without electrical conflicts.

```
         Pull-up       Pull-up
            ┌─┐           ┌─┐
            │R│           │R│
            └┬┘           └┬┘
             │             │
           ──┼─────────────┼──── VCC
             │             │
    ┌────────┼─────────────┼───────┐
    │        │             │       │
    │    ┌───┴───┐     ┌───┴───┐   │
    │    │  SDA  │     │  SCL  │   │
    │    └───────┘     └───────┘   │
    │   MICROCONTROLLER (MASTER)   │
    └────────────────────────────┬─┘
                                 │
    ┌────────────────────────────┼─┐
    │                            │ │
    │    ┌───────┐     ┌───────┐ │ │
    │    │  SDA  │     │  SCL  │ │ │
    │    └───┬───┘     └───┬───┘ │ │
    │        │             │     │ │
    │      DEVICE 1 (SLAVE)      │ │
    └────────────────────────────┘ │
                                   │
    ┌────────────────────────────┐ │
    │                            │ │
    │    ┌───────┐     ┌───────┐ │ │
    │    │  SDA  │     │  SCL  │ │ │
    │    └───┬───┘     └───┬───┘ │ │
    │        │             │     │ │
    │      DEVICE 2 (SLAVE)      │ │
    └────────────────────────────┘ │
                                   :
                                   :
```

## I2C Protocol Basics

### Addressing

- 7-bit addressing (standard mode) allows 128 unique devices on the bus
- 10-bit addressing (extended mode) allows up to 1024 unique devices
- Each device has a unique address assigned by the manufacturer
- Some devices allow configuring lower bits of the address through pins

### Communication Protocol

I2C communication consists of several key elements:

1. **Start Condition**: SDA transitions from high to low while SCL is high
2. **Device Addressing**: 7-bit or 10-bit address followed by a read/write bit
3. **Data Transfer**: 8-bit data bytes followed by an ACK/NACK bit
4. **Stop Condition**: SDA transitions from low to high while SCL is high

```
     START                                    STOP
    ┌─────┐                                  ┌─────┐
SDA │     └─────────────────────────────────┘     │
    │                                              │
    │     ┌─┐   ┌─┐   ┌─┐   ┌─┐         ┌─┐   ┌─┐ │
SCL │     │ │   │ │   │ │   │ │   ...   │ │   │ │ │
    └─────┘ └───┘ └───┘ └───┘ └─────────┘ └───┘ └─┘
            
            ▲       ▲       ▲                 ▲
            │       │       │                 │
 Byte 1:    │       │       │                 │
 Address   A7...    A1      R/W    ACK       ...
```

### Read/Write Operations

- The 8th bit following the 7-bit address determines if this is a read or write operation
- **0**: Write operation (master → slave)
- **1**: Read operation (slave → master)

### Acknowledgment (ACK/NACK)

After each byte transfer:
- The receiver pulls SDA low to send an ACK
- The receiver leaves SDA high to send a NACK
- For the address byte, an ACK means the addressed device exists and is ready
- For data bytes, a NACK can indicate the end of a read operation

## I2C Clock Speeds

I2C operates at different standardized speeds:
- **Standard Mode**: 100 kbit/s
- **Fast Mode**: 400 kbit/s
- **Fast Mode Plus**: 1 Mbit/s
- **High Speed Mode**: 3.4 Mbit/s
- **Ultra Fast Mode**: 5 Mbit/s (only available in one direction)

## C Code Example: I2C Master Implementation

Here's a basic example of I2C initialization and data transfer on an STM32 microcontroller:

```c
// I2C Initialization
void I2C_Init(void) {
    // Enable peripheral clocks
    RCC->APB1ENR |= RCC_APB1ENR_I2C1EN;  // Enable I2C1 clock
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOBEN; // Enable GPIOB clock
    
    // Configure GPIO pins for I2C1
    GPIOB->MODER |= (2 << (6 * 2)) | (2 << (7 * 2));    // Alternate function for PB6, PB7
    GPIOB->OTYPER |= (1 << 6) | (1 << 7);               // Open-drain for PB6, PB7
    GPIOB->OSPEEDR |= (3 << (6 * 2)) | (3 << (7 * 2));  // High speed for PB6, PB7
    GPIOB->PUPDR |= (1 << (6 * 2)) | (1 << (7 * 2));    // Pull-up for PB6, PB7
    GPIOB->AFR[0] |= (4 << (6 * 4)) | (4 << (7 * 4));   // AF4 (I2C) for PB6, PB7
    
    // Configure I2C parameters
    I2C1->CR1 = 0;                       // Reset I2C
    I2C1->CR2 = 16;                      // 16 MHz peripheral clock
    I2C1->CCR = 80;                      // 100 kHz I2C clock
    I2C1->TRISE = 17;                    // Maximum rise time
    I2C1->CR1 |= I2C_CR1_PE;             // Enable I2C
}

// Write data to I2C device
bool I2C_Write(uint8_t deviceAddr, uint8_t regAddr, uint8_t* data, uint16_t length) {
    // Generate START condition
    I2C1->CR1 |= I2C_CR1_START;
    while (!(I2C1->SR1 & I2C_SR1_SB));  // Wait for START condition generated
    
    // Send device address (write)
    I2C1->DR = deviceAddr << 1;
    while (!(I2C1->SR1 & I2C_SR1_ADDR));  // Wait for address sent
    I2C1->SR2;  // Clear ADDR flag
    
    // Send register address
    I2C1->DR = regAddr;
    while (!(I2C1->SR1 & I2C_SR1_TXE));  // Wait for data register empty
    
    // Send data
    for (uint16_t i = 0; i < length; i++) {
        I2C1->DR = data[i];
        while (!(I2C1->SR1 & I2C_SR1_TXE));  // Wait for data register empty
    }
    
    // Generate STOP condition
    I2C1->CR1 |= I2C_CR1_STOP;
    
    return true;
}

// Read data from I2C device
bool I2C_Read(uint8_t deviceAddr, uint8_t regAddr, uint8_t* buffer, uint16_t length) {
    // Generate START condition
    I2C1->CR1 |= I2C_CR1_START;
    while (!(I2C1->SR1 & I2C_SR1_SB));  // Wait for START condition generated
    
    // Send device address (write)
    I2C1->DR = deviceAddr << 1;
    while (!(I2C1->SR1 & I2C_SR1_ADDR));  // Wait for address sent
    I2C1->SR2;  // Clear ADDR flag
    
    // Send register address
    I2C1->DR = regAddr;
    while (!(I2C1->SR1 & I2C_SR1_TXE));  // Wait for data register empty
    
    // Generate RESTART condition
    I2C1->CR1 |= I2C_CR1_START;
    while (!(I2C1->SR1 & I2C_SR1_SB));  // Wait for START condition generated
    
    // Send device address (read)
    I2C1->DR = (deviceAddr << 1) | 1;
    while (!(I2C1->SR1 & I2C_SR1_ADDR));  // Wait for address sent
    I2C1->SR2;  // Clear ADDR flag
    
    // Enable acknowledgment
    I2C1->CR1 |= I2C_CR1_ACK;
    
    // Read data
    for (uint16_t i = 0; i < length; i++) {
        if (i == length - 1) {
            I2C1->CR1 &= ~I2C_CR1_ACK;  // Disable ACK for last byte
        }
        
        while (!(I2C1->SR1 & I2C_SR1_RXNE));  // Wait for data
        buffer[i] = I2C1->DR;
    }
    
    // Generate STOP condition
    I2C1->CR1 |= I2C_CR1_STOP;
    
    return true;
}
```

## Advanced I2C Features

### Clock Stretching

- Slaves can hold the SCL line low to pause communication
- Used when a slave needs more processing time
- The master must wait for the SCL line to go high before proceeding

### Arbitration

- Multiple masters can attempt to use the bus simultaneously
- When two masters output conflicting data on SDA, the one writing a "0" wins
- The losing master backs off and tries again later

### General Call Address

- The address 0x00 is a general call that all devices should respond to
- Used for broadcasting commands to all devices on the bus

## Advantages of I2C

- **Simplified Wiring**: Only two wires required regardless of the number of devices
- **Hardware Addressing**: No need for chip select lines, saving pins
- **Flexible**: Supports multiple masters and multiple slaves
- **Error Checking**: Built-in acknowledgment bit for each byte
- **Wide Adoption**: Available on most microcontrollers and supported by many peripherals

## Disadvantages of I2C

- **Speed Limitations**: Generally slower than SPI
- **Bus Capacitance**: Limited cable length due to capacitance issues
- **Complexity**: More complex protocol than UART or SPI
- **Address Conflicts**: Potential for address conflicts with fixed-address devices
- **Single-point Failure**: A device holding SDA or SCL low can freeze the entire bus

## Common I2C Interview Questions

1. **Q: How many wires are required for I2C communication?**
   A: Two wires - SDA (Serial Data) and SCL (Serial Clock), along with a common ground.

2. **Q: What is the difference between I2C and SPI?**
   A: I2C uses only two wires regardless of the number of devices and includes built-in addressing, while SPI requires a separate select line for each device but can achieve higher speeds.

3. **Q: What is clock stretching in I2C?**
   A: It's a mechanism where a slave device can hold the SCL line low to pause communication while it processes data, forcing the master to wait.

4. **Q: How are address conflicts resolved in I2C?**
   A: Some devices allow configuring part of their address using hardware pins. Otherwise, you cannot connect devices with the same fixed address to the same I2C bus.

5. **Q: How does I2C support multiple masters?**
   A: I2C has a built-in arbitration mechanism where if multiple masters try to communicate simultaneously, the one writing a "0" on the SDA line wins the arbitration.

## Practical Tips for Embedded Interviews

- Be prepared to explain I2C register configurations on your target microcontroller
- Understand common I2C-related debugging issues (addressing errors, clock configuration)
- Know common I2C peripherals (EEPROM, temperature sensors, real-time clocks, etc.)
- Explain how pull-up resistors work with open-drain signals
- Discuss how to calculate appropriate pull-up resistor values based on bus capacitance and desired speed