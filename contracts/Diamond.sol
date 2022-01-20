// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Diamond {
    struct Receipt {
        address clientWallet;
        address diamondId;
        string clientName;
        string status;
        uint256 price;
    }

    struct History {
        address ownerAddress;
        uint256 price;
    }

    struct DiamondData {
        address diamondId;
        string image;
        string name;
        string company;
    }

    address payable public owner;
    uint256 currentPrice;

    History[] public histories;
    Receipt[] public receipts;
    DiamondData public diamondData;

    constructor(
        string memory image,
        string memory name,
        string memory company
    ) payable {
        owner = payable(msg.sender);
        diamondData = DiamondData({
            diamondId: address(this),
            image: image,
            name: name,
            company: company
        });
    }

    function deposit() public payable {}

    function notPayable() public {}

    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function changeOwnership(address newOwner) private {
        owner = payable(newOwner);
    }

    function updateHistory(address ownerAddress, uint256 price)
        public
        onlyOwner
    {
        histories.push(History({ownerAddress: ownerAddress, price: price}));
        currentPrice = price;
    }

    function createPaidReceipt() private {
        Receipt memory receipt = lookupReceipts();
        receipts.push(
            Receipt({
                clientWallet: msg.sender,
                clientName: receipt.clientName,
                diamondId: address(this),
                price: receipt.price,
                status: "paid"
            })
        );
    }

    function checkoutPayment() public payable {
        Receipt memory receipt = lookupReceipts();
        require(msg.value == receipt.price);
        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Failed to send Ether");
        changeOwnership(msg.sender);
        updateHistory(msg.sender, msg.value);
        createPaidReceipt();
    }

    function upsertReceipt(string memory clientName, uint256 price) public {
        bool hasFound = false;
        uint256 foundIndex = 0;

        if (price < currentPrice) {
            revert("Price should larger than current price");
        }

        for (uint256 order = 0; order < receipts.length; order++) {
            if (receipts[order].clientWallet == msg.sender) {
                hasFound = true;
                foundIndex = order;
            }
        }
        if (!hasFound) {
            receipts.push(
                Receipt({
                    clientWallet: msg.sender,
                    clientName: clientName,
                    diamondId: address(this),
                    price: price,
                    status: "unpaid"
                })
            );
        } else {
            receipts[foundIndex] = Receipt({
                clientWallet: msg.sender,
                clientName: clientName,
                diamondId: address(this),
                price: price,
                status: "unpaid"
            });
        }
    }

    function lookupReceipts() public view returns (Receipt memory) {
        bool hasFound = false;
        uint256 foundIndex = 0;

        for (uint256 order = 0; order < receipts.length; order++) {
            if (receipts[order].clientWallet == msg.sender) {
                hasFound = true;
                foundIndex = order;
            }
        }

        if (hasFound) {
            return receipts[foundIndex];
        }

        revert("Not found");
    }

    function lookupHistories() public view returns (History[] memory) {
        return histories;
    }

    function lookupDiamondData()
        public
        view
        returns (DiamondData memory, address)
    {
        return (diamondData, owner);
    }
}
