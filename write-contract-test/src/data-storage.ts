import {
  DataWritten as DataWrittenEvent,
  DirectTransfer as DirectTransferEvent
} from "../generated/DataStorage/DataStorage"
import { DataWritten, DirectTransfer } from "../generated/schema"

export function handleDataWritten(event: DataWrittenEvent): void {
  let entity = new DataWritten(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.content = event.params.content
  entity.value = event.params.value
  entity.timestamp = event.params.timestamp
  entity.dataId = event.params.dataId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDirectTransfer(event: DirectTransferEvent): void {
  let entity = new DirectTransfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
