/**
 * Created by prateek on 7/6/16.
 */

var config = {};
config.privateKey = "-----BEGIN RSA PRIVATE KEY-----\n"+
"MIICXQIBAAKBgQDilT/Ga6mOsQEiHmkuKzCdyCDfHDLu0a/CaQixSqHrfQiy6ico\n"+
"q7agr6lOsiLkTBld0Cu02tUAQiyQyL7tPem27lp50QHC6GI2DLY4jSHBlgZ0ApMV\n"+
"CrVBtGoThJOAw5FaUbUJNIxxTaOIUekFXzGBaoCw9JpHlJaMrjSIFKLevwIDAQAB\n"+
"AoGAQck7nwybSkayIYna2ADKOMVmZeD2GMjg0v1T/MXChXDkGa5KeFCC0dyut56Y\n"+
"6tf9dXN/fR8cQNr1vYPLi24ycNJgO2tw2jf5no0j1psA+aqzPK0NMFBiPP1SxQis\n"+
"c3uMBYygUWDy5KDlFNmKv+L9ui3zDcXou+ynv7GBvRh+ryECQQD/vh9YU/ZnDtWL\n"+
"49Z7wZu3o7ofnaMXURDP56kksdVozI6LytXjwovm/sGgBTorPKYqUGF33OrKHGlx\n"+
"3BgkzYDVAkEA4s+dh6LMVSU5IIOMAXOshO6nld63dYlb5aSOff+I6afGVDtF+PVN\n"+
"zkToS1KwKghgLd/3wVIVabiqnlL3hY0LQwJBAJryexVOEb1RHIscKMhkfk8eMNeU\n"+
"78phwFjm1/E2mcFcJoWGCF9tcMwsz+1/HUYzAc4jU1qHC+4WlsB4hFxP8l0CQQCH\n"+
"oe4rSVB17m+OIPxddeYKDImNFwWQtRaOamyHroMabykr/9IlQdRIcG6VdJpCWIXj\n"+
"iRaotcR2V2c4jJbWd3TvAkBf2Btm+2Q9jRcBOq1dxZi6GYZRGe0/970sU2mIYJh5\n"+
"GXGsnq5k7+60sCdVjNkC9Cr3lapuker2FfFPJUuKSfq5\n"+
"-----END RSA PRIVATE KEY-----\n";

config.publicKey = "-----BEGIN PUBLIC KEY-----\n"+
"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDilT/Ga6mOsQEiHmkuKzCdyCDf\n"+
"HDLu0a/CaQixSqHrfQiy6icoq7agr6lOsiLkTBld0Cu02tUAQiyQyL7tPem27lp5\n"+
"0QHC6GI2DLY4jSHBlgZ0ApMVCrVBtGoThJOAw5FaUbUJNIxxTaOIUekFXzGBaoCw\n"+
"9JpHlJaMrjSIFKLevwIDAQAB\n"+
"-----END PUBLIC KEY-----";

config.defaultChips = 5000;

config.defaultSips = [
    {
        "gameName":"Poker",
        "sips": 0
    },
    {
        "gameName":"BlackJack",
        "sips": 0
    },
    {
        "gameName":"Roulette",
        "sips": 0
    },
    {
        "gameName":"Never_Ever",
        "sips": 0
    },
    {
        "gameName":"King_Game",
        "sips": 0
    },
    {
        "gameName":"Spin_Bottle",
        "sips": 0
    }
];

config.host = "127.0.0.1";

config.port = "27017"


module.exports = config;