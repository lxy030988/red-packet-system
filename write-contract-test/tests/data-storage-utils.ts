import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  DataWritten,
  DirectTransfer
} from "../generated/DataStorage/DataStorage"

export function createDataWrittenEvent(
  sender: Address,
  content: string,
  value: BigInt,
  timestamp: BigInt,
  dataId: BigInt
): DataWritten {
  let dataWrittenEvent = changetype<DataWritten>(newMockEvent())

  dataWrittenEvent.parameters = new Array()

  dataWrittenEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  dataWrittenEvent.parameters.push(
    new ethereum.EventParam("content", ethereum.Value.fromString(content))
  )
  dataWrittenEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )
  dataWrittenEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  dataWrittenEvent.parameters.push(
    new ethereum.EventParam("dataId", ethereum.Value.fromUnsignedBigInt(dataId))
  )

  return dataWrittenEvent
}

export function createDirectTransferEvent(
  from: Address,
  to: Address,
  amount: BigInt,
  timestamp: BigInt
): DirectTransfer {
  let directTransferEvent = changetype<DirectTransfer>(newMockEvent())

  directTransferEvent.parameters = new Array()

  directTransferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  directTransferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  directTransferEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  directTransferEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return directTransferEvent
}
