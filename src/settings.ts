export default class Settings {
  public static TARGET: string = 'http://localhost:1880'
  public static USER: string = 'admin'
  public static PASS: string = process.env.NRPWD
  public static UPSTREAM: string = 'http://localhost:1880'
  public static UPSTREAM_USER: string = 'admin'
  public static UPSTREAM_PASS: string = process.env.NRPWD
  
  public static TARGET1: string = 'http://localhost:1880'
  public static TARGET2: string = 'http://localhost:2880'
  public static TARGET3: string = 'http://localhost:3880'
  public static TARGET4: string = 'http://localhost:4880'
  public static TARGET5: string = 'http://localhost:5880'
}