import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2Body from "@/Box2D/Dynamics/b2Body";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import GlassShard from "@/com/totaljerkface/game/level/userspecials/GlassShard";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class GlassShard2 extends GlassShard {
    protected stabbing: boolean;

    constructor(
        param1: b2Body,
        param2: Sprite,
        param3: Sprite,
        param4: boolean,
    ) {
        super(param1, param2, param3);
        this.stabbing = param4;
    }

    protected override setValues() {
        var _loc1_: number = this.body.GetMass();
        this.shatterImpulse = _loc1_ * 10;
        if (this.stabbing) {
            this.stabImpulse = Math.min(this.body.m_mass * 5, 2.5);
            if (_loc1_ < 0.1) {
                this.bloodParticles = 15;
                this.stabImpulse = 0;
            }
            if (_loc1_ >= 0.25 && this.sprite.width >= 15) {
                this.fatal = true;
            }
        } else {
            this.stabImpulse = this.shatterImpulse;
        }
        if (_loc1_ < 0.75) {
            this.soundSuffix = "Light";
            this.glassParticles = 50;
        } else if (_loc1_ < 4) {
            this.soundSuffix = "Mid";
            this.glassParticles = 100;
        } else {
            this.soundSuffix = "Heavy";
            this.glassParticles = 200;
        }
    }

    public override actions() {
        var _loc1_: number = 0;
        if (this.add) {
            _loc1_ = 0;
            while (_loc1_ < this.bodiesToAdd.length) {
                this.createPrisJoint(
                    this.bodiesToAdd[_loc1_],
                    this.normals[_loc1_],
                );
                _loc1_++;
            }
            this.bodiesToAdd = new Array();
            this.normals = new Array();
            this.add = false;
        }
        if (this.remove) {
            _loc1_ = 0;
            while (_loc1_ < this.bodiesToRemove.length) {
                this.removeJoint(this.bodiesToRemove[_loc1_]);
                _loc1_++;
            }
            this.bodiesToRemove = new Array();
            this.remove = false;
            this.checkZeroJoints();
        }
    }

    protected checkZeroJoints() {
        var _loc2_: {} = null;
        var _loc3_: Session = null;
        var _loc4_: ContactListener = null;
        var _loc5_: b2FilterData = null;
        var _loc1_: number = 0;
        for (_loc2_ of this.bjDictionary.keys()) {
            _loc1_ += 1;
        }
        if (_loc1_ == 0) {
            _loc3_ = Settings.currentSession;
            _loc4_ = _loc3_.contactListener;
            _loc4_.deleteListener(ContactEvent.RESULT, this.shape);
            _loc5_ = new b2FilterData();
            _loc5_.categoryBits = 8;
            this.shape.SetFilterData(_loc5_);
            _loc3_.m_world.Refilter(this.shape);
            _loc4_.registerListener(
                ContactEvent.RESULT,
                this.shape,
                this.checkContact,
            );
            _loc4_.deleteListener(ContactListener.ADD, this.sensor);
            _loc4_.deleteListener(ContactListener.REMOVE, this.sensor);
            this.body.DestroyShape(this.sensor);
            this.sensor = null;
            _loc3_.level.removeFromActionsVector(this);
        }
    }
}