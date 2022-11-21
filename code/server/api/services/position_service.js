'use strict'

class PositionService {
    constructor(dao) {
        this.dao = dao
    }

    getPositions=async ()=>{
        try {
            const pos = await this.dao.getPositions()
            const message = pos.map((r) => ({
                positionID: r.positionID,
                aisleID: r.aisleID,
                row: r.row,
                col: r.col,
                maxWeight:r.maxWeight,
                maxVolume:r.maxVolume,
                occupiedWeight:r.occupiedWeight,
                occupiedVolume:r.occupiedVolume,
            }))
            return {
            ok: true,
            status: 200,
            body: message
            }
        } catch(e) {

            return {
            ok: false,
            status: 500
            }
        }
    }

    createPosition= async (positionID, aisleID, row, col, maxVolume, maxWeight)=>{
        try{
            const response=await this.dao.createPosition(
                positionID,
                aisleID,
                row,
                col,
                maxVolume,
                maxWeight,
            )
            return {
            ok: true,
            status: 201,
            }
        }catch(e){

            return {
            ok: false,
            status: e
            }
        }
    }

    editPosition= async (positionID, aisleID, row, col, maxVolume, maxWeight, occupiedVolume, occupiedWeight)=>{
        const newPositionID=aisleID+row+col;
        try{
            const response=await this.dao.editPosition(
                positionID,
                newPositionID,
                aisleID,
                row,
                col,
                maxVolume,
                maxWeight,
                occupiedVolume,
                occupiedWeight,
            )
            return {
            ok: true,
            status: 200,
            }
        }catch(e){

            if (e === 'id not found') {
                return{
                    ok: false,
                    status: 404
                }
            }
            return {
            ok: false,
            status: 503
            }
        }
    }

    editPositionID= async (newPositionID,oldPositionID)=>{
        try{
            const aisleID=newPositionID.substring(0,4);
            const row=newPositionID.substring(4,8);
            const col=newPositionID.substring(8,12);
            const response=await this.dao.editPositionID(
                newPositionID,
                oldPositionID,
                aisleID,
                row,
                col,
            )
            return {
            ok: true,
            status: 200,
            }
        }catch(e){

            if (e === 'id not found') {
                return{
                    ok: false,
                    status: 404
                }
            }
            return {
            ok: false,
            status: 503
            }
        }
    }

    deletePosition= async (rfid)=>{
        try{
            const response=await this.dao.deletePosition(
                rfid
            )
            return {
            ok: true,
            status: 204,
            }
        }catch(e){

            if (e === 'id not found') {
                return{
                    ok: false,
                    status: 404
                }
            }
            return {
            ok: false,
            status: 503
            }
        }
    }
}

module.exports = PositionService