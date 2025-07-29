import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import Settings from "@/com/totaljerkface/game/Settings";
import bloodMC from "@/top/bloodMC";
import vanGlass from "@/top/vanGlass";
import Bitmap from "flash/display/Bitmap";
import BitmapData from "flash/display/BitmapData";
import BlendMode from "flash/display/BlendMode";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
// import BevelFilter from "flash/filters/BevelFilter";
import ArrowSnap from "@/com/totaljerkface/game/particles/ArrowSnap";
import BloodBurst from "@/com/totaljerkface/game/particles/BloodBurst";
import BloodBurst2 from "@/com/totaljerkface/game/particles/BloodBurst2";
import BloodFlow from "@/com/totaljerkface/game/particles/BloodFlow";
import BloodSpray from "@/com/totaljerkface/game/particles/BloodSpray";
import Burst from "@/com/totaljerkface/game/particles/Burst";
import Burst2 from "@/com/totaljerkface/game/particles/Burst2";
import BurstRect from "@/com/totaljerkface/game/particles/BurstRect";
import Emitter from "@/com/totaljerkface/game/particles/Emitter";
import Flow from "@/com/totaljerkface/game/particles/Flow";
import Flow2 from "@/com/totaljerkface/game/particles/Flow2";
import SnowSpray from "@/com/totaljerkface/game/particles/SnowSpray";
import SparkBurst from "@/com/totaljerkface/game/particles/SparkBurst";
import SparkBurstPoint from "@/com/totaljerkface/game/particles/SparkBurstPoint";
import Spray from "@/com/totaljerkface/game/particles/Spray";
import { boundClass } from 'autobind-decorator';
import BlurFilter from "flash/filters/BlurFilter";
import Matrix from "flash/geom/Matrix";
import Point from "flash/geom/Point";
import Rectangle from "flash/geom/Rectangle";

@boundClass
export default class ParticleController {
    public static drawnParticles: boolean;
    public static maxParticles: number = 2000;
    public static totalParticles: number = 0;
    private bloodBmdArray: any[];
    private vanBmdArray: any[];
    private particleDict: Dictionary<any, any>;
    private emitters: any[];
    private containerSprite: Sprite;
    private bloodSetting: number;
    private bloodSprite: Sprite;
    private bloodBitmap1: Bitmap;
    private bloodBMD1: BitmapData;
    private blurFilter: BlurFilter;

    constructor(param1: Sprite) {
        this.emitters = new Array();
        this.particleDict = new Dictionary();
        this.containerSprite = param1;
        this.createVanShardBitmaps();
        this.createBloodBitmaps();
        this.bloodSprite = new Sprite();
        this.bloodSetting = Settings.bloodSetting;
        if (this.bloodSetting > 1) {
        }
        if (this.bloodSetting > 2) {
            this.bloodBMD1 = new BitmapData(900, 500, true);
            this.bloodBitmap1 = new Bitmap(this.bloodBMD1);
            this.bloodBitmap1.alpha = 0.8;
            this.blurFilter = new BlurFilter(4, 4, 3);
        }
        if (this.bloodSetting > 3) {
            this.bloodBitmap1.blendMode = BlendMode.HARDLIGHT;
            this.bloodBitmap1.alpha = 1;
        }
    }

    public placeBloodBitmap() {
        var _loc1_: Sprite = null;
        if (this.bloodBitmap1) {
            _loc1_ = Settings.currentSession.level.foreground;
            if (_loc1_) {
                this.containerSprite.addChildAt(
                    this.bloodBitmap1,
                    this.containerSprite.getChildIndex(_loc1_),
                );
            }
        }
    }

    private createBloodBitmaps() {
        var _loc4_: BitmapData = null;
        this.bloodBmdArray = new Array();
        // var _loc1_ = new BevelFilter(1, 90, 16752029, 1, 5308416, 1, 0, 0);
        var _loc2_: MovieClip = new bloodMC();
        _loc2_.filters = [/*_loc1_*/];
        var _loc3_: number = 1;
        while (_loc3_ < 14) {
            _loc2_.gotoAndStop(_loc3_);
            _loc4_ = new BitmapData(_loc2_.width, _loc2_.height, true, 0);
            _loc4_.draw(_loc2_);
            this.bloodBmdArray.push(_loc4_);
            _loc3_++;
        }
        this.particleDict.set("blood", this.bloodBmdArray);
    }

    private createVanShardBitmaps() {
        var _loc4_: BitmapData = null;
        this.vanBmdArray = new Array();
        // var _loc1_ = new BevelFilter(5, 90, 16777215, 1, 5308416, 1, 5, 5);
        var _loc2_: MovieClip = new vanGlass();
        _loc2_.filters = [/*_loc1_*/];
        var _loc3_: number = 1;
        while (_loc3_ < 14) {
            _loc2_.gotoAndStop(_loc3_);
            _loc4_ = new BitmapData(_loc2_.width, _loc2_.height, true, 0);
            _loc4_.draw(_loc2_);
            this.vanBmdArray.push(_loc4_);
            _loc3_++;
        }
        this.particleDict.set("vanglass", this.vanBmdArray);
    }

    public createBMDArray(
        param1: string,
        param2: MovieClip,
        param3: any[] = null,
    ) {
        var _loc6_: BitmapData = null;
        if (this.particleDict.get(param1)) {
            return;
        }
        var _loc4_ = new Array();
        if (param3) {
            param2.filters = param3;
        }
        var _loc5_: number = 1;
        while (_loc5_ < param2.totalFrames + 1) {
            param2.gotoAndStop(_loc5_);
            _loc6_ = new BitmapData(param2.width, param2.height, true, 0);
            _loc6_.draw(param2);
            _loc4_.push(_loc6_);
            _loc5_++;
        }
        this.particleDict.set(param1, _loc4_);
    }

    public createBloodFlow(
        param1: number,
        param2: number,
        param3: b2Body,
        param4: b2Vec2,
        param5: number,
        param6: number,
        param7: Sprite,
        param8: number = -1,
    ): Emitter {
        var _loc9_: Emitter = null;
        if (this.bloodSetting == 1) {
            _loc9_ = new Flow2(
                this.bloodBmdArray,
                param1,
                param2,
                param3,
                param4,
                param5,
                param6,
            );
            if (param8 == -1) {
                param7.addChild(_loc9_);
            } else {
                param7.addChildAt(_loc9_, param8);
            }
        } else if (this.bloodSetting == 2) {
            _loc9_ = new BloodFlow(
                null,
                param3,
                param4,
                param5,
                param1,
                param2,
                param6,
            );
            if (param8 == -1) {
                param7.addChild(_loc9_);
            } else {
                param7.addChildAt(_loc9_, param8);
            }
        } else {
            _loc9_ = new BloodFlow(
                this.bloodSprite,
                param3,
                param4,
                param5,
                param1,
                param2,
                param6,
            );
        }
        this.emitters.push(_loc9_);
        return _loc9_;
    }

    public createBloodBurst(
        param1: number,
        param2: number,
        param3: b2Body,
        param4: number,
        param5: b2Vec2,
        param6: Sprite,
        param7: number = -1,
    ): Emitter {
        var _loc8_: Emitter = null;
        if (this.bloodSetting == 1) {
            _loc8_ = new Burst2(
                this.bloodBmdArray,
                param1,
                param2,
                param3,
                param5,
                param4,
            );
            if (param7 == -1) {
                param6.addChild(_loc8_);
            } else {
                param6.addChildAt(_loc8_, param7);
            }
        } else if (this.bloodSetting == 2) {
            _loc8_ = new BloodBurst2(
                null,
                param1,
                param2,
                param3,
                param5,
                param4,
            );
            if (param7 == -1) {
                param6.addChild(_loc8_);
            } else {
                param6.addChildAt(_loc8_, param7);
            }
        } else {
            _loc8_ = new BloodBurst2(
                this.bloodSprite,
                param1,
                param2,
                param3,
                param5,
                param4,
            );
        }
        this.emitters.push(_loc8_);
        return _loc8_;
    }

    public createPointBloodBurst(
        param1: number,
        param2: number,
        param3: number,
        param4: number,
        param5: number,
        param6: number = -1,
    ): Emitter {
        var _loc7_: Emitter = null;
        if (this.bloodSetting == 1) {
            _loc7_ = new Burst(
                this.bloodBmdArray,
                param1,
                param2,
                param3,
                param4,
                param5,
            );
            if (param6 == -1) {
                this.containerSprite.addChild(_loc7_);
            } else {
                this.containerSprite.addChildAt(_loc7_, param6);
            }
        } else if (this.bloodSetting == 2) {
            _loc7_ = new BloodBurst(
                null,
                param1,
                param2,
                param3,
                param4,
                param5,
            );
            if (param6 == -1) {
                this.containerSprite.addChild(_loc7_);
            } else {
                this.containerSprite.addChildAt(_loc7_, param6);
            }
        } else {
            _loc7_ = new BloodBurst(
                this.bloodSprite,
                param1,
                param2,
                param3,
                param4,
                param5,
            );
        }
        this.emitters.push(_loc7_);
        return _loc7_;
    }

    public createBloodSpray(
        param1: b2Body,
        param2: b2Vec2,
        param3: b2Vec2,
        param4: number,
        param5: number,
        param6: number,
        param7: number,
        param8: number,
        param9: Sprite,
        param10: number = -1,
    ): Emitter {
        var _loc11_: Emitter = null;
        if (this.bloodSetting == 1) {
            _loc11_ = new Spray(
                this.bloodBmdArray,
                param1,
                param2,
                param3,
                param4,
                param5,
                param6,
                param7,
                param8,
            );
            if (param10 == -1) {
                param9.addChild(_loc11_);
            } else {
                param9.addChildAt(_loc11_, param10);
            }
        } else if (this.bloodSetting == 2) {
            _loc11_ = new BloodSpray(
                null,
                param1,
                param2,
                param3,
                param4,
                param5,
                param6,
                param7,
                param8,
            );
            if (param10 == -1) {
                param9.addChild(_loc11_);
            } else {
                param9.addChildAt(_loc11_, param10);
            }
        } else {
            _loc11_ = new BloodSpray(
                this.bloodSprite,
                param1,
                param2,
                param3,
                param4,
                param5,
                param6,
                param7,
                param8,
            );
        }
        this.emitters.push(_loc11_);
        return _loc11_;
    }

    public createFlow(
        param1: string,
        param2: number,
        param3: number,
        param4: b2Body,
        param5: b2Vec2,
        param6: number,
        param7: number,
        param8: number = -1,
    ): Flow2 {
        var _loc9_ = new Flow2(
            this.particleDict[param1],
            param2,
            param3,
            param4,
            param5,
            param6,
            param7,
        );
        if (param8 == -1) {
            this.containerSprite.addChild(_loc9_);
        } else {
            this.containerSprite.addChildAt(_loc9_, param8);
        }
        this.emitters.push(_loc9_);
        return _loc9_;
    }

    public createPointFlow(
        param1: string,
        param2: number,
        param3: number,
        param4: number,
        param5: number,
        param6: number,
        param7: number,
        param8: number = -1,
    ): Flow {
        var _loc9_ = new Flow(
            this.particleDict[param1],
            param2,
            param3,
            param4,
            param5,
            param6,
            param7,
        );
        if (param8 == -1) {
            this.containerSprite.addChild(_loc9_);
        } else {
            this.containerSprite.addChildAt(_loc9_, param8);
        }
        this.emitters.push(_loc9_);
        return _loc9_;
    }

    public createBurst(
        param1: string,
        param2: number,
        param3: number,
        param4: b2Body,
        param5: number,
        param6: number = -1,
    ): Burst {
        var _loc7_ = new Burst2(
            this.particleDict[param1],
            param2,
            param3,
            param4,
            new b2Vec2(0, 0),
            param5,
        );
        if (param6 == -1) {
            this.containerSprite.addChild(_loc7_);
        } else {
            this.containerSprite.addChildAt(_loc7_, param6);
        }
        this.emitters.push(_loc7_);
        return _loc7_;
    }

    public createPointBurst(
        param1: string,
        param2: number,
        param3: number,
        param4: number,
        param5: number,
        param6: number,
        param7: number = -1,
    ): Burst {
        var _loc8_ = new Burst(
            this.particleDict[param1],
            param2,
            param3,
            param4,
            param5,
            param6,
        );
        if (param7 == -1) {
            this.containerSprite.addChild(_loc8_);
        } else {
            this.containerSprite.addChildAt(_loc8_, param7);
        }
        this.emitters.push(_loc8_);
        return _loc8_;
    }

    public createRectBurst(
        param1: string,
        param2: number,
        param3: b2Body,
        param4: number,
        param5: number = -1,
    ): Burst {
        var _loc6_: Burst = new BurstRect(
            this.particleDict[param1],
            param2,
            param3,
            param4,
        );
        if (param5 == -1) {
            this.containerSprite.addChild(_loc6_);
        } else {
            this.containerSprite.addChildAt(_loc6_, param5);
        }
        this.emitters.push(_loc6_);
        return _loc6_;
    }

    public createSpray(
        param1: string,
        param2: b2Body,
        param3: b2Vec2,
        param4: b2Vec2,
        param5: number,
        param6: number,
        param7: number,
        param8: number,
        param9: number,
        param10: Sprite,
        param11: number = -1,
    ): Spray {
        var _loc12_ = new Spray(
            this.particleDict[param1],
            param2,
            param3,
            param4,
            param5,
            param6,
            param7,
            param8,
            param9,
        );
        if (param11 == -1) {
            param10.addChild(_loc12_);
        } else {
            param10.addChildAt(_loc12_, param11);
        }
        this.emitters.push(_loc12_);
        return _loc12_;
    }

    public createSnowSpray(
        param1: string,
        param2: b2Body,
        param3: b2Vec2,
        param4: b2Vec2,
        param5: number,
        param6: number,
        param7: number,
        param8: number,
        param9: number,
        param10: Sprite,
        param11: number = -1,
    ): SnowSpray {
        var _loc12_ = new SnowSpray(
            this.particleDict[param1],
            param2,
            param3,
            param4,
            param5,
            param6,
            param7,
            param8,
            param9,
        );
        if (param11 == -1) {
            param10.addChild(_loc12_);
        } else {
            param10.addChildAt(_loc12_, param11);
        }
        this.emitters.push(_loc12_);
        return _loc12_;
    }

    public createSparkBurst(
        param1: b2Body,
        param2: b2Vec2,
        param3: number,
        param4: number,
        param5: number,
        param6: number = -1,
    ): SparkBurst {
        var _loc7_ = new SparkBurst(param1, param2, param3, param4, param5);
        if (param6 == -1) {
            this.containerSprite.addChild(_loc7_);
        } else {
            this.containerSprite.addChildAt(_loc7_, param6);
        }
        this.emitters.push(_loc7_);
        return _loc7_;
    }

    public createSparkBurstPoint(
        param1: b2Vec2,
        param2: b2Vec2,
        param3: number,
        param4: number,
        param5: number,
        param6: number = -1,
    ): SparkBurstPoint {
        var _loc7_ = new SparkBurstPoint(
            param1,
            param2,
            param3,
            param4,
            param5,
        );
        if (param6 == -1) {
            this.containerSprite.addChild(_loc7_);
        } else {
            this.containerSprite.addChildAt(_loc7_, param6);
        }
        this.emitters.push(_loc7_);
        return _loc7_;
    }

    public createArrowSnap(
        param1: b2Body,
        param2: number,
        param3: Sprite = null,
        param4 = -1,
    ): ArrowSnap {
        var _loc5_ = new ArrowSnap(param1, param2);
        if (param4 == -1) {
            this.containerSprite.addChild(_loc5_);
        } else {
            param3.addChildAt(_loc5_, param4);
        }
        this.emitters.push(_loc5_);
        return _loc5_;
    }

    public step() {
        var _loc2_: Emitter = null;
        var _loc3_: Rectangle = null;
        var _loc4_: Matrix = null;
        this.bloodSprite.graphics.clear();
        var _loc1_: number = 0;
        while (_loc1_ < this.emitters.length) {
            _loc2_ = this.emitters[_loc1_];
            if (_loc2_.step() == false) {
                _loc2_.die();
                if (_loc2_.parent) {
                    _loc2_.parent.removeChild(_loc2_);
                }
                this.emitters.splice(_loc1_, 1);
                _loc1_--;
            }
            _loc1_++;
        }
        if (this.bloodSetting > 2) {
            this.bloodBMD1.fillRect(this.bloodBMD1.rect, 0);
            if (ParticleController.drawnParticles) {
                ParticleController.drawnParticles = false;
                _loc3_ = Settings.currentSession.camera.screenBounds;
                this.bloodBitmap1.x = _loc3_.x;
                this.bloodBitmap1.y = _loc3_.y;
                _loc4_ = new Matrix();
                _loc4_.translate(-_loc3_.x, -_loc3_.y);
                this.bloodBMD1.draw(
                    this.bloodSprite,
                    _loc4_,
                    null,
                    null,
                    new Rectangle(0, 0, 900, 500),
                );
                this.bloodBMD1.applyFilter(
                    this.bloodBMD1,
                    this.bloodBMD1.rect,
                    new Point(0, 0),
                    this.blurFilter,
                );
                this.bloodBMD1.threshold(
                    this.bloodBMD1,
                    this.bloodBMD1.rect,
                    new Point(0, 0),
                    ">=",
                    1409286144,
                    4288217088,
                    4278190080,
                    false,
                );
                this.bloodBMD1.threshold(
                    this.bloodBMD1,
                    this.bloodBMD1.rect,
                    new Point(0, 0),
                    "<",
                    1409286144,
                    0,
                    4278190080,
                    false,
                );
                if (this.bloodSetting == 4) {
                    // this.bloodBMD1.applyFilter(
                    //     this.bloodBMD1,
                    //     this.bloodBMD1.rect,
                    //     new Point(0, 0),
                    //     new BevelFilter(
                    //         4,
                    //         90,
                    //         16777215,
                    //         0.3,
                    //         0,
                    //         0.3,
                    //         4,
                    //         4,
                    //         1,
                    //         3,
                    //     ),
                    // );
                }
            }
        }
    }

    public die() {
        var _loc2_: Emitter = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.emitters.length) {
            _loc2_ = this.emitters[_loc1_];
            _loc2_.die();
            if (_loc2_.parent) {
                _loc2_.parent.removeChild(_loc2_);
            }
            _loc1_++;
        }
        this.emitters = null;
        ParticleController.totalParticles = 0;
        this.bloodSprite.graphics.clear();
        if (this.bloodSprite.parent) {
            this.bloodSprite.parent.removeChild(this.bloodSprite);
        }
        this.bloodSprite = null;
        if (this.bloodBMD1) {
            this.bloodBMD1.dispose();
            this.bloodBMD1 = null;
            if (this.bloodBitmap1.parent) {
                this.bloodBitmap1.parent.removeChild(this.bloodBitmap1);
            }
            this.bloodBitmap1 = null;
        }
    }
}