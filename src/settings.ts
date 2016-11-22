export default class Settings {
  public static TARGET: string = 'http://seawolf1.westgrid.ca:1880'
  public static USER: string = 'admin'
  public static PASS: string = process.env.NRPWD
  public static UPSTREAM: string = 'http://seawolf1.westgrid.ca:1818'
  public static UPSTREAM_USER: string = 'admin'
  public static UPSTREAM_PASS: string = process.env.NRPWD
}