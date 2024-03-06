import { AccountPage } from '../AccountPage'
import { BreadCrumb } from '../BreadCrumb'
import '../../../style/AccountPage/AccountBase.css'

export const Security = () => {

  return (
    <div className='dashboard'>
      <div className="container p-1">
        <div className="row h-100">
          <BreadCrumb path={["account", "security"]}/>
          <div className="col-2">
            <div className="account-left">
              <AccountPage />
            </div>
          </div>
          <div className="col-10 account-right">
            <div className="row mb-3">
              <div className="col-12">
                <div className="page-title">
                    <h3>Security</h3>
                </div>
              </div>
            </div>
            <div className="content">
              sa security
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
