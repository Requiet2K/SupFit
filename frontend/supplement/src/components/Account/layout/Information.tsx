import '../../../style/AccountPage/AccountBase.css'
import { AccountPage } from '../AccountPage'
import { BreadCrumb } from '../BreadCrumb'

export const Information = () => {

  return (
    <div className='information'>
      <div className="container p-1">
        <div className="row h-100">
          <BreadCrumb path={["account", "information"]}/>
          <div className="col-2">
            <div className="account-left">
              <AccountPage />
            </div>
          </div>
          <div className="col-10 account-right">
            <div className="row mb-3">
              <div className="col-12">
                <div className="page-title">
                    <h3>Information</h3>
                </div>
              </div>
            </div>
            <div className="content">
              sa information
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



